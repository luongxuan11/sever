// tại sao tên tệp lại là y: đây là 1 bảng add thêm column và nếu lần đầu tạo thì sẽ có kiểu time
// nếu đã xóa time thì sequelize sẽ tạo bảng theo apha nên đặt y để nó sẽ chạy cuối cùng

module.exports = {
    up: function(queryInterface, Sequelize) {
      // logic for transforming into the new state
      return queryInterface.addColumn(
        'Images',
        'fileName',
       Sequelize.STRING
      );
  
    },
  
    down: function(queryInterface, Sequelize) {
      // logic for reverting the changes
      return queryInterface.removeColumn(
        'Images',
        'fileName'
      );
    }
  }