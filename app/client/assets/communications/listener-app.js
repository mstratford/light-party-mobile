// Use SockJS
Stomp.WebSocketClass = SockJS;

// Connection parameters
var mq_username = "controlPublisher",
    mq_password = "LightMyPhone",
    mq_vhost    = "/",
    mq_url      = 'http://192.168.0.40:15674/stomp',

    // The queue we will read. The /topic/ queues are temporary
    // queues that will be created when the client connects, and
    // removed when the client disconnects. They will receive
    // all messages published in the "amq.topic" exchange, with the
    // given routing key, in this case "test"
    mq_queue    = "/topic/test";


// This is where we print incomoing messages
var output;

// This will be called upon successful connection
function on_connect() {
  console.log(client);
  client.subscribe(mq_queue, on_message);
}

// This will be called upon a connection error
function on_connect_error() {
  output.innerHTML += 'Connection failed!<br />';
}

// This will be called upon arrival of a message
function on_message(m) {
  console.log('message received'); 
  console.log(m);
  if (m.body.substring(0, 7) == ";class;") {
    output.className = m.body.slice(7);
  } else if (m.body.substring(0, 7) == ";style;") {
    output.style = m.body.slice(7); //Doesn't work with Safari or WinPhone
  } else if (m.body.substring(0, 4) == ";FX;") {
    $("#shape-overlay").css('animation', m.body.slice(4));
    
  } else if (m.body.substring(0, 8) == ";colour;") {
  	$("#shape-overlay").css('background-color', m.body.slice(8));
    
  }
  $("body").addClass("dummyClass").removeClass("dummyClass");
  $("#shape-overlay").addClass("dummyClass").removeClass("dummyClass");
}

// Create a client
var client = Stomp.client(mq_url);

window.onload = function () {
  // Fetch output panel
  output = document.getElementById("body")
  output2 = document.getElementById("shape-overlay")

  // Connect
  client.connect(
    mq_username,
    mq_password,
    on_connect,
    on_connect_error,
    mq_vhost
  );
    
}

