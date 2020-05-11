import { spWebContext } from '../providers/SPWebContext';
import "@pnp/sp/search";
import ActivitiesApiDev from './ActivitiesApiDev';
import { ICamlQuery } from '@pnp/sp/lists';
import { IItems } from '@pnp/sp/items';

export interface UserInfo {
  Id: string,
  Title: string,
  SPUserId?: string,
  text?: string
}

export interface UserList {
  results: UserInfo[]
}

export interface UserIdList {
  results: number[]
}

export interface IActivity {
  Id: number,
  Title: string,
  WeekOf: string,
  Branch: string,
  ActionTaken: string,
  IsBigRock: boolean,
  IsHistoryEntry: boolean,
  IsDeleted?: boolean,
  OPRs?: UserList,
  OPRsId?: UserIdList,
  __metadata?: {
    etag: string
  }
}

export interface IActivityApi {
  fetchActivitiesByNumWeeks(numWeeks: number, weekStart: Date, userId: number): Promise<any>,
  fetchActivitiesByDates(startDate?: Date, endDate?: Date, userId?: number, additionalFilter?: string, orderBy?: string): Promise<any>,
  fetchActivitiesByQueryString(query: string, userId?: number): Promise<any>,
  fetchBigRocksByDates(startDate: Date, endDate: Date, userId: number): Promise<any>,
  fetchHistoryEntriesByDates(startDate: Date, endDate: Date, userId: number): Promise<any>,
  deleteActivity(activity: IActivity): Promise<any>,
  submitActivity(activity: IActivity): Promise<{ data: IActivity }>
}

export default class ActivitiesApi implements IActivityApi {

  activitiesList = spWebContext.lists.getByTitle("Activities");

  fetchActivitiesByNumWeeks(numWeeks: number, weekStart: Date, userId: number): Promise<any> {
    let maxDate = new Date(weekStart);
    maxDate.setDate(maxDate.getDate() + 1);
    let minDate = new Date(weekStart);
    minDate.setDate(minDate.getDate() - (numWeeks * 7));
    return this.fetchActivitiesByDates(minDate, maxDate, userId);
  }

  fetchActivitiesByDates(startDate?: Date, endDate?: Date, userId?: number, additionalFilter?: string, orderBy?: string): Promise<any> {
    let filterString = "IsDeleted ne 1"
    filterString += startDate ? ` and WeekOf ge '${startDate.toISOString()}'` : "";
    filterString += endDate ? ` and WeekOf le '${endDate.toISOString()}'` : "";
    filterString += userId && userId !== null ? ` and AuthorId eq ${userId}` : "";
    filterString += additionalFilter ? ` and ${additionalFilter}` : "";

    let items: IItems = this.activitiesList.items.select("Id", "Title", "WeekOf", "Branch", "OPRs/Title", "OPRs/Id", "Org", "ActionTaken", "IsBigRock", "IsHistoryEntry", "IsDeleted").expand("OPRs").filter(filterString);
    items = orderBy && orderBy !== null && orderBy !== "" ? items.orderBy(orderBy, false) : items;
    return items.get();
  }

  async fetchActivitiesByQueryString(query: string, userId?: number): Promise<IActivity> {
    const caml: ICamlQuery = {
      ViewXml: `<View>
                  <ViewFields>
                    <FieldRef Name='Id' />
                    <FieldRef Name='Title' />
                    <FieldRef Name='WeekOf' />
                    <FieldRef Name='Branch' />
                    <FieldRef Name='ActionTaken' />
                    <FieldRef Name='OPRs' />
                    <FieldRef Name='IsBigRock' />
                    <FieldRef Name='IsHistoryEntry' />
                    <FieldRef Name='IsDeleted' />
                  </ViewFields>
                  <Query>
                    <Where>
                      ${userId && userId !== null ? `<And>
                        <Eq>
                          <FieldRef Name='Author' LookupId='True' />
                          <Value Type='Lookup'>${userId}</Value>
                        </Eq>` : ""}
                        ${query ? `<And>` : ""}
                          <Neq>
                            <FieldRef Name='IsDeleted' />
                            <Value Type='Boolean'>1</Value>
                          </Neq>
                          ${query ? `<Contains>
                            <FieldRef Name='ActionTaken' />
                            <Value Type='Note'>${query}</Value>
                          </Contains></And>` : ""}
                      ${userId && userId !== null ? "</And>" : ""}
                    </Where>
                    <OrderBy>
                      <FieldRef Name='WeekOf' Ascending='FALSE'/>
                    </OrderBy>
                  </Query>
                </View>`,
    };
    let newActivities = await this.activitiesList.renderListDataAsStream(caml);
    /* Of course SharePoint doesn't return data in the same format from this function as it does
       with the REST API. Below steps convert to the standard format so results can be used normally */
    return newActivities.Row.map((activity: any) => {
      activity.OPRs = activity.OPRs.map((OPR: any) => {
        return {
          Id: OPR.id,
          Email: OPR.id,
          Title: OPR.title
        };
      })
      return {
        Id: activity.ID,
        Title: activity.Title,
        WeekOf: activity["WeekOf."],
        Branch: activity.Branch,
        ActionTaken: activity.ActionTaken,
        IsBigRock: activity.IsBigRock === "Yes" ? true : false,
        IsHistoryEntry: activity.IsHistoryEntry === "Yes" ? true : false,
        IsDeleted: activity.IsDeleted === "Yes" ? true : false,
        OPRs: { results: activity.OPRs },
        __metadata: { etag: `"${activity.owshiddenversion}"` }
      };
    });
  }

  fetchBigRocksByDates(startDate: Date, endDate: Date, userId: number): Promise<any> {
    return this.fetchActivitiesByDates(startDate, endDate, userId, "IsBigRock eq 1");
  }

  fetchHistoryEntriesByDates(startDate: Date, endDate: Date, userId: number): Promise<any> {
    return this.fetchActivitiesByDates(startDate, endDate, userId, "IsHistoryEntry eq 1");
  }

  deleteActivity(activity: IActivity): Promise<any> {
    let deletedActivity: IActivity = { ...activity, IsDeleted: true };
    return this.updateActivity(deletedActivity);
  }

  /**
   * This will either submit a new Activity or it will update an 
   * existing one. Both will return the Activity as {data: activity}
   * @param activity The IActivity to be submitted
   */
  submitActivity(activity: IActivity): Promise<{ data: IActivity }> {
    return activity.Id < 0 ? this.addActivity(activity) : this.updateActivity(activity);
  }

  /**
   * Trying to match the return behavior of adding a new Activity 
   * so that the returns can be treated the same/similar
   * @param activity The IActivity to be submitted
   */
  async updateActivity(activity: IActivity): Promise<{ data: IActivity }> {
    let etag = activity.__metadata?.etag;
    if (etag) {
      delete activity.__metadata;
    }
    return this.activitiesList.items.getById(activity.Id).update(activity, etag);
  }

  addActivity(activity: IActivity): Promise<{ data: IActivity }> {
    return this.activitiesList.items.add(activity);
  }
}

export class ActivitiesApiConfig {
  static activitiesApi: IActivityApi = process.env.NODE_ENV === 'development' ? new ActivitiesApiDev() : new ActivitiesApi();
}