const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', function (error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        let queue = 'hello-nodejs';

        channel.assertQueue(queue, {
            durable: false,
        });

        console.log('[*] waiting for messages in %s. To exit press ctrl+c');
        channel.consume(
            queue,
            function (msg) {
                console.log('[x] Received %s', msg.content.toString());
            },
            {
                noAck: true,
            }
        );
    });
});
