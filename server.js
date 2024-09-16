require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('test.ejs');
});

app.post('/checkout', async (req, res) => {
    const phoneQuantity = parseInt(req.body.phoneQuantity);
    const watchQuantity = parseInt(req.body.watchQuantity);

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Smart Phone'
                        },
                        unit_amount: 300 * 100 // price for one phone in cents
                    },
                    quantity: phoneQuantity
                },
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Smart Watch'
                        },
                        unit_amount: 50 * 100 // price for one watch in cents
                    },
                    quantity: watchQuantity
                }
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/complete',
            cancel_url: 'http://localhost:3000/cancel'
        });

        res.redirect(session.url);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).send('Server error');
    }
});

app.get('/complete', (req, res) => {
    res.send('Your payment was successful!');
});

app.get('/cancel', (req, res) => {
    res.redirect('/');
});

app.listen(3500, () => {
    console.log('Server is running on port 3000');
});
