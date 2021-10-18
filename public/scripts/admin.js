const ADMIN = {
  username: "",
  password: "",
};

let authenticated = false;
if (adminRoute) {
  $(document).ready(function () {
    $("#loginForm").on("submit", function (e) {
      e.preventDefault();
      if (
        $("#username").val() === ADMIN.username &&
        $("#password").val() === ADMIN.password
      ) {
        authenticated = true;
        loadAuthenticatedScreen();
      } else {
        $("#worngCred").toast("show");
      }
    });
  });
}

var loadAuthenticatedScreen = function () {
  $("#unauthenticated").hide();
  $("#authenticated").show();

  $.get("/api/order", function (data) {
    const { incompleteOrders } = data;
    const orders = incompleteOrders.map((order)=> {
      return {
        ...order,
        orderList: JSON.parse(order.orders)
      }
    });

    console.log(orders);

    var container = $("#orderDetailsContainer");
    if (orders.length > 0) {
      orders.forEach((element, index) => {
        container.append(`<li class="list-group-item menu-item">
        <div class="row">
          <div class="col-md-3">
          ${index + 1}. Order ID: ${element.id}
          </div>

          <div class="col-md-3">
            Customer id: ${element.customer_id}
          </div>
            <div class="col-md-3">
              Total Amount: $${element.totalamount}
            </div>
        </div>
        <div class="row">
        ${JSON.parse(element.ordersList).forEach(order=>{
          return `
          ${order.name}
          `
        })}
        </div>
    </li>`);
      });
    }
  });
};