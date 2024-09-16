require('dotenv').config(); // Added parentheses
const express = require('express');
const { default: helmet } = require('helmet');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Fixed typo

app.use(helmet())

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs'); // Removed unnecessary headers here
});

app.post('/checkout', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Smart Watch'
                        },
                        unit_amount: 50 * 100
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/complete', // Fixed typo
            cancel_url: 'http://localhost:3000/cancel'
        });
        //console.log(session)
        res.redirect(session.url)

        //res.json({ id: session.id }); // Return session details to the client
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).send('Server error');
    }
});

app.get('/complete',(req,res)=>{
    res.send('your payment was successfull')
})

app.get('/cancel',(req,res)=>{
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
