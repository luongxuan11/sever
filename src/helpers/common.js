export const getNumberFromString = (string) => {
    let number = 0;
    if (string.includes('đồng')) {  // nếu là đồng
      const numberString = string.match(/\d+/)[0];
      if (numberString.length > 0) {
        number = +numberString / Math.pow(10, 3); // chia cho 10^3 <=> 1000
      }
    } else if (string.includes('triệu')) {
      number = +string.match(/\d+/)[0];
    }else if(string.includes('m')){
      number = +string.match(/\d+/)[0];
    }
    return number;
  };

  export const getNumberFromStringV2 = (string) => {
    let number = 0;
    if (string.includes('đồng')) {  // nếu là đồng
      const numberString = string.match(/\d+/)[0];
      if (numberString.length > 0) {
        number = +numberString / Math.pow(10, 3); // chia cho 10^3 <=> 1000
      }
    } else if (string.includes('triệu')) {
      number = +string.split(" ")[0]
    }else if(string.includes('m')){
      number = +string.match(/\d+/)[0];
    }
    return +number;
  };