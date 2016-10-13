class PubSub {
  constructor() {
    this.topics = [];
    this.subscriberUid = -1;
  }

  publish(topic, args) {
    // Why would you publish a topic that doesn't exist?
    if (!this.topics[topic]) {
      return false;
    }

    let subscribers = this.topics[topic];
    let subscriberCount = subscribers ? subscribers.length : 0;

    while (subscriberCount--) {
      subscribers[subscriberCount].func(topic, args);
    }

    return this;
  }

  subscribe(topic, func) {
    if (!this.topics[topic]) {
      this.topics[topic] =  [];
    }

    let token = (++this.subscriberUid).toString();

    this.topics[topic].push({
      token: token,
      func: func
    });

    return token;
  }

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

let pubSub = new PubSub();

export default pubSub;
