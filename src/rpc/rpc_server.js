const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', function (error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        let queue = 'rpc_queue';

        channel.assertQueue(queue, {
            durable: false,
        });

        channel.prefetch(1);

        console.log('[x] Waiting RPC request');

        channel.consume(queue, function replay(msg) {
            let n = parseInt(msg.content.toString());

            console.log('[n] fib(%d)', n);

            let r = fibonacci(n);

            channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(r.toString()),
                {
                    correlationId: msg.properties.correlationId,
                }
            );

            channel.ack(msg);
        });
    });
});

function fibonacci(n) {
    if (n == 0 || n == 1) return n;
    else return fibonacci(n - 1) + fibonacci(n - 2);
}
