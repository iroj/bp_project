var orders = [];
var actualOrder = [];
var menuitems = [];
var totalAmount = 0;
if (!adminRoute) {
  $(document).ready(function () {
    $("#confirmOrder").on("shown.bs.modal", function () {
      getOrderDetails();
    });

    $("#userForm").on("submit", function (e) {
      e.preventDefault();
      var orderDetails = {
        customer: {
          fullname: $("#fullName").val(),
          address: $("#address").val(),
          phnumber: $("#phNumber").val(),
        },
        orders: actualOrder,
        total: totalAmount,
        completed: false,
      };
      $.post("/api/order", orderDetails, (res) => {
        $("#confirmOrder").modal("hide");
        $("#orderReceived").toast("show");
        resetOrders();
      });
    });
  });

  $.get("/api/menuitems", function (data) {
    menuitems = data.menuitems;
    orders = menuitems.map((item) => {
      return {
        id: item.id,
        quantity: 0,
      };
    });
    var container = $("#menuitems");
    if (menuitems.length > 0) {
      menuitems.forEach((element) => {
        container.append(`<li class="list-group-item menu-item row">
      <div class="pull-left text-center col-md-3 item-image">
        <img
          id="item-image"
          src="${element.imglink}"
          class="img-reponsive img-rounded img-menu"
        />
        <p>Price: $<span id="item-price">${element.price}</span></p>
      </div>
      <div class="col-md-6 item-description" id="item-description">${element.description}</div>

      <div class="pull-right col-md-3 item-quantity">
        <input type="number" min=0 id="${element.id}"/>
      </div>
    </li>`);
      });
    }
    var orderinputs = $("input");
    orderinputs.on("change", function () {
      addOrder(this);
    });
  });
}

var resetOrders = function () {
  orders = [];
  actualOrder = [];
  totalAmount = 0;
  // $("#menuitems :input").each(() => {
  //   console.log($(this));
  //   $(this).val("0");
  // });
  // console.log($("#menuitems :input"));
};

var addOrder = function (el) {
  const selectedItem = orders.findIndex((item) => item.id === parseInt(el.id));
  const selectedmenuItem = menuitems.find(
    (item) => item.id === parseInt(el.id)
  );
  if (selectedItem > -1) {
    orders.splice(selectedItem, 1);
    orders.push({
      id: parseInt(el.id),
      quantity: parseInt(el.value),
      name: selectedmenuItem.name,
      rate: selectedmenuItem.price,
      amount: selectedmenuItem.price * parseInt(el.value),
    });
  }
  enableOrderButton();
};

var enableOrderButton = function () {
  actualOrder = orders.filter((item) => item.quantity > 0);
  if (actualOrder.length > 0) {
    $("#orderBtn").prop("disabled", false);
    return;
  }
  $("#orderBtn").prop("disabled", true);
};

var getOrderDetails = function () {
  totalAmount = actualOrder.reduce((tot, item) => (tot += item.amount), 0);
  var container = $("#orderDetails");
  if (actualOrder.length > 0) {
    actualOrder.forEach((element, index) => {
      container.append(`<li class="list-group-item menu-item row">
    <div class="col-md-6">
    ${index + 1}. ${element.name}
    </div>
    <div class="col-md-3">${element.quantity}</div>
    <div class="col-md-3">
$${element.amount}
    </div>
  </li>`);
    });

    container.append(`<li class="list-group-item menu-item row">
    <div class="col-md-12 text-center">
    Total: $${totalAmount}
    </div>
    `);
  }
};
