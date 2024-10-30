const amqp = require('amqplib/callback_api');

let args = process.argv.slice(2);

if (args.length == 0) {
    console.log('Usage: receive_logs_direct.js <speed>.<colour>.<species>');
    process.exit(1);
}

amqp.connect('amqp://localhost:5672', function (error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        let exchange = 'topic_logs';
        channel.assertExchange(exchange, 'topic', {
            durable: false,
        });

        channel.assertQueue(
            '',
            {
                exclusive: true,
            },
            function (error2, q) {
                if (error2) {
                    throw error2;
                }

                console.log(
                    '[*] Waiting for messages in %s. To exit press CTRL+C',
                    q.queue
                );

                args.forEach(function (key) {
                    channel.bindQueue(q.queue, exchange, key);
                });

                channel.consume(
                    q.queue,
                    function (msg) {
                        console.log(
                            "[x] %s : '%s'",
                            msg.fields.routingKey,
                            msg.content.toString()
                        );
                    },
                    {
                        noAck: true,
                    }
                );
            }
        );
    });
});
