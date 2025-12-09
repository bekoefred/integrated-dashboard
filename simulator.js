const EventEmitter = require('events');

class SipSimulator extends EventEmitter {
  constructor(trunks) {
    super();
    this.trunks = trunks;
    this.running = false;
  }

  start() {
    this.running = true;
    this.simulate();
  }

  stop() {
    this.running = false;
  }

  simulate() {
    if (!this.running) return;

    // Randomly pick a trunk to update
    const trunkIndex = Math.floor(Math.random() * this.trunks.length);
    const trunk = this.trunks[trunkIndex];

    // Generate a random event
    const events = [
      { type: 'status', value: 'Up' },
      { type: 'status', value: 'Down' },
      { type: 'status', value: 'Lag' },
      { type: 'calls', value: Math.floor(Math.random() * 50) }, // Active calls
      { type: 'latency', value: Math.floor(Math.random() * 200) + 'ms' }
    ];

    const event = events[Math.floor(Math.random() * events.length)];

    // Emit the update
    this.emit('update', {
      trunkId: trunk.id,
      ...event,
      timestamp: new Date().toISOString()
    });

    // Schedule next update (random interval between 500ms and 3s)
    setTimeout(() => this.simulate(), Math.random() * 2500 + 500);
  }
  
  updateTrunks(newTrunks) {
      this.trunks = newTrunks;
  }
}

module.exports = SipSimulator;
