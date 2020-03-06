import React, { Component } from 'react';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { spWebContext } from '../../providers/SPWebContext';
import './Activities.css';
import ActivityAccordion from './ActivityAccordion';
import EditActivityModal from './EditActivityModal';

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      isLoading: true,
      showAddModal: false,
      showDeleteModal: false,
      deleteItemId: -1,
      showEditModal: false,
      editActivity: {},
      editItemID: -1
    };
    this.web = spWebContext;
    let today = new Date();
    this.weekStart = new Date(today.getYear(), today.getMonth(), today.getDate() - today.getDay(), 0, 0, 0, 0);
  }

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = () => {
    this.setState({ isLoading: true });
    if (process.env.NODE_ENV === 'development') {
      // Emulate a "long" web call so we can watch the spinners
      setTimeout(() => {
        let listData = [
          {
            ID: '1', Title: 'SP BAC', WeekOf: '2020-03-01T06:00:00Z', Branch: 'OZI',
            InterestItems: 'Lorem\n ipsum\n dolor sit amet, consectetur adipiscing elit.\n Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.',
            ActionItems: 'Informational.', OPRs: 'Robert Porterfield; Jeremy Clark'
          },
          {
            ID: '2', Title: 'SP Support', WeekOf: '2020-03-01T06:00:00Z', Branch: 'OZI',
            InterestItems: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.',
            ActionItems: 'Informational.', OPRs: 'Robert Porterfield'
          },
          {
            ID: '3', Title: 'SP Support', WeekOf: '2020-02-23T06:00:00Z', Branch: 'OZI',
            InterestItems: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.',
            ActionItems: 'Informational.', OPRs: 'Robert Porterfield'
          }
        ];
        this.setState({ isLoading: false, listData })
      }, // end of arrow function
        3000); // timeout duration
    } else {
      this.web.lists.getByTitle("Activities").items.get().then(r => {
        console.log(r);
        this.setState({ isLoading: false, listData: r });
      }, e => {
        console.error(e);
        this.setState({ isLoading: false });
      });
    }
  }

  saveItem = ID => {
    // do some saving here
    let listData = this.state.listData;
    let itemIndex = listData.findIndex(item => item.ID === ID);
    let item = listData[itemIndex];
    item.Title = 'New Title';
    item.InterestItems = 'New Interests';
    item.ActionItems = 'New Actions!';
    listData[itemIndex] = item;
    if (ID === 'New') {
      item.ID = this.state.newID;
      // Probably not thread safe - just for easy testing
      this.setState({ listData, newItem: false, newID: item.ID + 1 });
    }
    this.setState({ listData });
  };

  deleteItem = ID => {
    // delete operation to remove item
    let newData = this.state.listData.filter(el => el.ID !== ID);
    this.setState({ listData: newData });
  };

  newItem = () => {
    let item = {
      ID: 'New', Title: 'New Item', WeekOf: '2020-03-01T06:00:00Z', Branch: 'OZI',
      InterestItems: 'Items of interest...',
      ActionItems: 'Informational.', OPRs: 'Robert Porterfield'
    }
    let newData = this.state.listData;
    newData.push(item);
    this.setState({ listData: newData, newItem: true });
  }

  submitEditActivity = () => {
    this.setState({ showEditModal: false });
  }

  renderData = () => {
    const { newItem } = this.state;
    return (
      <>
        <ActivityAccordion 
          weekOf='2020-03-01T06:00:00Z' 
          actions={this.state.listData} 
          disableNewButton={newItem} 
          newButtonOnClick={() => this.newItem()} 
          cardOnClick={(action) => this.setState({ showEditModal: true, editActivity: action })}
        />
        <ActivityAccordion 
          weekOf='2020-02-23T06:00:00Z' 
          actions={this.state.listData} 
          disableNewButton={newItem} 
          newButtonOnClick={() => this.newItem()} 
          cardOnClick={(action) => this.setState({ showEditModal: true, editActivity: action })}
        />
      </>
    );
  }

  render() {
    const { isLoading } = this.state;
    const MySpinner = () =>
      <Row className="h-100 justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner> Loading...
      </Row>

    return (
      <Container>
        <EditActivityModal
          showEditModal={this.state.showEditModal}
          submitEditActivity={this.submitEditActivity}
          activity={this.state.editActivity}
        />
        <Row className="justify-content-center"><h1>My Items</h1></Row>
        {isLoading ? <MySpinner /> : this.renderData()}
      </Container>
    );
  }
}

export default Activities;