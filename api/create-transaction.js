const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: 'https://privacy-negrini.netlify.app',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions)); // permite chamadas do seu front que estará em outro domínio
app.use(express.json());

app.post('/api/create-transaction', async (req, res) => {
    // aqui seu código para chamar BlackCat etc
    try {

        const name = req.body.name;
        const email = req.body.email;
        const cpf = req.body.cpf;
        const amount = req.body.amount;
        console.log(name, email, cpf, amount)

        const url = 'https://api.blackcatpagamentos.com/v1/transactions';
        const publicKey = 'pk_74YmFVok9UzuHkf4sSFJN0OvgYosYNIAO5xjB5qE8vDA0dFh';
        const secretKey = 'sk_QbyjTsvIBkRTSkStla_0bCP55XqTS_fzB8IjsHk9_76EXt1x';
        const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

        var options = {
            method: 'POST',
            url: url,
            headers: {
                accept: 'application/json',
                authorization: auth,
                'content-type': 'application/json'
            },
            data: {
                amount: amount,
                currency: 'BRL',
                paymentMethod: 'pix',
                shipping: {
                    fee: 0,
                    address: {
                        street: 'R Virginia de Pátaro Adami',
                        streetNumber: '223',
                        neighborhood: 'Barão Geraldo',
                        city: 'Campinas',
                        state: 'SP',
                        country: 'BR',
                        zipCode: '13084045'
                    }
                },
                customer: {
                    name: name,
                    email: email,
                    document: { type: 'cpf', number: cpf }
                },
                items: [{ title: 'privacy negrini', unitPrice: amount, quantity: 1, tangible: false }]
            }
        };

        const response = await axios.request(options);
        const qrCode = response.data.pix.qrcode;

        // Envia o QR code de volta pro front
        res.json({ qrcode: qrCode });

    } catch (error) {
        console.error('Erro na requisição:', error);
    }
});
app.get('/api/dummie',(req, res)=>{
    res.json({name:"dummie dummie dummie"})
})

app.listen(port, () => console.log(`API rodando na porta ${port}`));
