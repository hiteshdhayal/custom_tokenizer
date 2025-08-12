class CustomTokenizer {
    constructor() {
        this.vocab = {}; // Vocabulary {token: index}
        this.inv_vocab = {}; // Inverse vocabulary {index: token}
        this.nextIndex = 0;

        // Special tokens
        this.specialTokens = {
            PAD: '[PAD]',
            UNK: '[UNK]',
            SEP: '[SEP]',
            CLS: '[CLS]',
        };
        
        // Add special tokens to vocab
        Object.values(this.specialTokens).forEach(token => {
            this.addToken(token);
        });
    }

    // Add a token to the vocabulary
    addToken(token) {
        if (!this.vocab[token]) {
            this.vocab[token] = this.nextIndex;
            this.inv_vocab[this.nextIndex] = token;
            this.nextIndex += 1;
        }
    }

    // Tokenize a piece of text into words or tokens
    tokenize(text) {
        // Basic tokenizer based on word boundaries
        return text.split(/\s+/).map(word => {
            if (!this.vocab[word]) {
                this.addToken(word); // Add new words dynamically to vocab
            }
            return word;
        });
    }

    // Encode a list of tokens into indices
    encode(text) {
        const tokens = this.tokenize(text);
        return tokens.map(token => this.vocab[token] || this.vocab[this.specialTokens.UNK]);
    }

    // Decode a list of indices back into text
    decode(indices) {
        return indices.map(index => this.inv_vocab[index] || this.specialTokens.UNK).join(' ');
    }

    // Get the size of the vocabulary
    vocabSize() {
        return Object.keys(this.vocab).length;
    }
}

const tokenizer = new CustomTokenizer();

document.getElementById('encodeButton').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value.trim();
    const encodedTokens = tokenizer.encode(inputText);
    document.getElementById('encodedOutput').textContent = JSON.stringify(encodedTokens, null, 2);

    const decodedText = tokenizer.decode(encodedTokens);
    document.getElementById('decodedOutput').textContent = decodedText;

    document.getElementById('vocabSize').textContent = `Vocabulary Size: ${tokenizer.vocabSize()}`;
});

document.getElementById('decodeButton').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value.trim();
    const encodedTokens = JSON.parse(inputText);
    const decodedText = tokenizer.decode(encodedTokens);
    document.getElementById('decodedOutput').textContent = decodedText;
});
