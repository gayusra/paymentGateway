require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require ('path')


app.use(express.static(path.join(__dirname,'public')))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('test.ejs');
});

app.post('/checkout', async (req, res) => {
    let line_items = [];

    if (req.body.phoneQuantity) {
        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: { name: 'Smart Phone',
                    images:['https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-pink?wid=5120&hei=2880&fmt=webp&qlt=70&.v=UXp1U3VDY3IyR1hNdHZwdFdOLzg1V0tFK1lhSCtYSGRqMUdhR284NTN4OUtONFJuV1pCdWVXaWp6ZXpQQi9FWXF2TWlpSzUzejRCZGt2SjJUNGl1VEtsS0dZaHBma3VTb3UwU2F6dkc4TGZqTWwxUjR3emtKcFNGYngyU0EvOWU=&traceId=1']
                 },
                unit_amount:500 * 100 //  price for one watch in paise (1 INR = 100 paise)
            },
            quantity: parseInt(req.body.phoneQuantity),
        }); 
    }

    if (req.body.watchQuantity) 
        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: { name: 'Smart Watch',
                    images:[
                       ' https://i5.walmartimages.com/asr/2c1c2ccc-39a1-4aec-9430-5d1d934eb465.c315ee059f382bc635a801d8a5cb4325.jpeg'
                    ]
                 },
                unit_amount: 300*100// price for one watch in cents
            },
            quantity: parseInt(req.body.watchQuantity),
        });


    if(req.body.bagQuantity){
        line_items.push({
            price_data:{
                currency:'usd',
                product_data:{name:'Office Bag',
                    images:['https://m.media-amazon.com/images/I/61OneI4LZ3L._SX679_.jpg']
                },
                unit_amount:100 * 100,
            },
            quantity:parseInt(req.body.bagQuantity)
        })
    }

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: 'http://localhost:3500/complete',
            cancel_url: 'http://localhost:3500/cancel',
        });

        res.redirect(session.url);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).send('Server error');
    }
});


app.get('/complete', (req, res) => {
    res.render('success')
    
});

app.get('/cancel', (req, res) => {
    res.redirect('/');
});

app.listen(3500, () => {
    console.log('Server is running on port 3000');
});
