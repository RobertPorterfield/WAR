import * as React from 'react';
import { Row, Col, ListGroup, ListGroupItem, TabContent, TabPane, TabContainer } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { RolesSubSection } from "./RolesSubSection";
import { RolesContext } from "./RolesContext";
import RoleUtilities, { IUserRole } from '../../utilities/RoleUtilities';

export interface IRolesProps {
	user: IUserRole
}

export const Roles: React.FunctionComponent<IRolesProps> = ({ user }) => {
	//TODO: Only display items if they belong to roles TBD
	const rolesContext = React.useContext(RolesContext);
	const { loading } = rolesContext;
	const roles = RoleUtilities.getEditableRoles(user);

	return (
		<TabContainer id="role-list" defaultActiveKey={"#/RoleManagement/" + roles[0]}>
			<Row>
				<Col xs="auto">
					<ListGroup>
						{roles.map((role) => (
							<LinkContainer key={role} to={"/RoleManagement/" + role}>
								<ListGroupItem action>
									{role}s
								</ListGroupItem>
							</LinkContainer>
						))}
					</ListGroup>
				</Col>
				<Col>
					{loading ? <h1>Loading...</h1> : <>
						{roles.map((role) => (
							<TabContent key={role}>
								<TabPane eventKey={"#/RoleManagement/" + role}>
									<RolesSubSection roleType={role} />
								</TabPane>
							</TabContent>
						))}
					</>
					}
				</Col>
			</Row>
		</TabContainer>
	);
}