// This class is a very simple Publish/Subscribe implementation.
// Acts as a mediator between the various modules of an application
// Proudly borrowed from Addy Osmani's minimalist implemenation "pubsubz"
// and simply updated with ES6 syntax.
// Original code: https://github.com/addyosmani/pubsubz

class PubSub {
  constructor() {
    this.topics = [];
    this.subscriberUid = -1;
  }

  // Broadcasts a topic to any subscribers
  // passes any neccessary data for the subscriber to handle
  // as needed.
  publish(topic, args) {
    // Why would you publish a topic that doesn't exist?
    // Make sure it's there first
    if (!this.topics[topic]) {
      return false;
    }

    let subscribers = this.topics[topic];
    let subscriberCount = subscribers ? subscribers.length : 0;

    // Fire a given function on each subscriber
    while (subscriberCount--) {
      subscribers[subscriberCount].func(topic, args);
    }

    return this;
  }

  // Allows functionality to be built into code based on the topic
  // broadcasted. When a topic is published the function passed in as a
  // parameter will be fired.
  subscribe(topic, func) {
    if (!this.topics[topic]) {
      this.topics[topic] =  [];
    }
    // Add the subscriber to the list of topics with a unique token
    let token = (++this.subscriberUid).toString();

    this.topics[topic].push({
      token: token,
      func: func
    });

    // Return the unique token in case the subscriber wants to
    // unsubscribe from the topic.
    return token;
  }

  // If a subscriber needs to unsubscribe it can pass in it's unique
  // token as a parameter.
  unsubscribe(token) {
    for (let m in this.topics) {
      if (this.topics[m]) {
        for (let i = 0, j = this.topics[m].length; i < j; i++) {
          if (this.topics[m][i].token === token) {
            this.topics[m].splice(i, 1);
            return token;
          }
        }
      }
    }
    return this;
  }
}

// Instantiate the module so the same instance is shared accross the
// application when imported.
let pubSub = new PubSub();

export default pubSub;
