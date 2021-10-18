const ADMIN = {
  username: "admin",
  password: "password",
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
    const orders = incompleteOrders.map((order) => {
      return {
        ...order,
        orderList: JSON.parse(order.orders)
      }
    });

    console.log(orders);

    var container = $("#orderDetailsContainer");
    if (orders.length > 0) {
      orders.forEach((element, index) => {
        container.append(`<li class="list-group-item">
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
          <div class="col-md-3">
            <button class="btn btn-success" id=ready${element.id} onclick="setOrderReady(${element.id})">Ready</button>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <p>Order Details</p>
            <ul id="order-items${element.id}" class="list-group">
            </ul>
          </div>
        </div>
    </li>`);

        var orderItems = $(`#order-items${element.id}`);
        element.orderList.forEach((item, i) => {
          orderItems.append(`<li class="list-group-item">
              ${item.name}
              <span class="badge bg-primary rounded-pill float-end">${item.quantity}</span>
          </li>`)
        })

      });
    }
  });
};

var setOrderReady = function (orderId) {
  console.log(orderId);

  $.post("/api/order/ready", {
    orderId
  }, function (data) {
     $("#orderDetailsContainer").empty()
    loadAuthenticatedScreen();
  });
}
