const formatDateForDisplay = (date:Date) => date.toLocaleString('default', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

const DateHelpers = {
  formatDateForDisplay,
};

export default DateHelpers;
