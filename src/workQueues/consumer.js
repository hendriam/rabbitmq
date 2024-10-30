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

        // Assert a queue (declare)
        channel.assertQueue(queue, {
            durable: true,
        });

        channel.prefetch(1);

        console.log(
            `[*] Waiting for messages in ${queue}. To exit press CTRL+C`
        );

        // Consume messages from the queue
        channel.consume(
            queue,
            (msg) => {
                console.log(`[x] Received ${msg.content.toString()}`);

                // Simulate a long processing task
                setTimeout(() => {
                    console.log('[x] Done processing');
                    // Acknowledge that the message has been processed
                    channel.ack(msg);
                }, 2000);
            },
            {
                noAck: false,
            }
        );
    });
});
