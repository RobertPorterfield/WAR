
  // Emulate a "long" web call so we can watch the spinners
  async function GetActivityDevDefaults() {
    const sleep = m => new Promise(r => setTimeout(r, m));
    let listData = [
      {
        ID: '1', Title: 'SP BAC', WeekOf: '2020-03-01T06:00:00Z', Branch: 'OZI',
        InterestItems: 'Lorem\n ipsum\n dolor sit amet, consectetur adipiscing elit.\n Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.',
        ActionItems: 'Informational.', TextOPRs: 'Robert Porterfield; Jeremy Clark'
      },
      {
        ID: '2', Title: 'SP Support', WeekOf: '2020-03-01T06:00:00Z', Branch: 'OZI',
        InterestItems: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.',
        ActionItems: 'Informational.', TextOPRs: 'Robert Porterfield'
      },
      {
        ID: '3', Title: 'SP Support', WeekOf: '2020-02-23T06:00:00Z', Branch: 'OZI',
        InterestItems: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.',
        ActionItems: 'Informational.', TextOPRs: 'Robert Porterfield'
      }
    ];
    await sleep(3000);
    return listData;
  }

export default GetActivityDevDefaults;