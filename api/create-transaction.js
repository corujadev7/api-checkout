const express = require('express');
const axios = require('axios');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

const corsOptions = {
  origin: 'https://privacy-negrini.netlify.app',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

// Rota POST create-transaction
app.post('/api/create-transaction', async (req, res) => {
  try {
    const { name, email, cpf, amount } = req.body;

    const url = 'https://api.blackcatpagamentos.com/v1/transactions';
    const publicKey = 'pk_74YmFVok9UzuHkf4sSFJN0OvgYosYNIAO5xjB5qE8vDA0dFh';
    const secretKey = 'sk_QbyjTsvIBkRTSkStla_0bCP55XqTS_fzB8IjsHk9_76EXt1x';
    const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

    const options = {
      method: 'POST',
      url,
      headers: {
        accept: 'application/json',
        authorization: auth,
        'content-type': 'application/json'
      },
      data: {
        amount,
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
          name,
          email,
          document: { type: 'cpf', number: cpf }
        },
        items: [{ title: 'privacy negrini', unitPrice: amount, quantity: 1, tangible: false }]
      }
    };

    const response = await axios.request(options);
    const qrCode = response.data.pix.qrcode;

    res.json({ qrcode: qrCode });
  } catch (error) {
    console.error('Erro na requisição:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

// Rota GET dummie
app.get('/api/dummie', (req, res) => {
  res.json({ name: "dummie dummie dummie" });
});

// Exporta a função serverless para a Vercel usar
module.exports.handler = serverless(app);
