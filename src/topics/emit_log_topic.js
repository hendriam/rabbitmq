const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', function (error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        let exchange = 'topic_logs';
        let args = process.argv.slice(2);
        let key = args.length > 0 ? args[0] : 'quick.orange';
        let msg = args.slice(1).join(' ') || 'Hello World!';

        channel.assertExchange(exchange, 'topic', {
            durable: false,
        });

        channel.publish(exchange, key, Buffer.from(msg));

        console.log('[x] Sent %s: "%s"', key, msg);
    });

    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 500);
});
