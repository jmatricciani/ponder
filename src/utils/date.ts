export const dateToString = (date: Date) => {
  return `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  }:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;
  //     (
  //     date.getMonth() +
  //     1 +
  //     '/' +
  //     date.getDate() +
  //     '/' +
  //     date.getFullYear() +
  //     ' ' +
  //     date.getHours() +
  //     ':' +
  //     date.getMinutes() +
  //     ':' +
  //     date.getSeconds()
  //   );
};
