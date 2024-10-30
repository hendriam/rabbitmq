const amqp = require('amqplib/callback_api');

// Connect to RabbitMQ server
amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }

    // Create a channel
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        const queue = 'task_queue';
        const message = 'Hello, RabbitMQ!';

        // Assert a queue (declare)
        channel.assertQueue(queue, {
            durable: true,
        });

        // Send a message to the queue
        channel.sendToQueue(queue, Buffer.from(message), {
            persistent: true,
        });

        console.log(`[x] Sent ${message}`);
    });

    // Close the connection after a short delay
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
});
