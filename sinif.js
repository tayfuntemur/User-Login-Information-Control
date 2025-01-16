// Bu tür bir uygulama için her sınıfı adım adım tanımlayalım. Burada, her form elemanı
//  için belirli kurallar uygulanacak ve bu kurallar doğrultusunda form verilerinin doğruluğu 
//  kontrol edilecektir.

// 1. Rule Sınıfı
// Rule sınıfı, form elemanları için belirli doğrulama kurallarını tanımlar. Her kuralın bir 
// hata mesajı olacaktır ve isValid metodu, kuralların geçerli olup olmadığını kontrol edecektir.


class Rule {
    constructor(username, errorText, validationFunc) {
        this.username = username;
        this.errorText = errorText;
        this.validationFunc = validationFunc;
    }

    isValid(value) {
        return this.validationFunc(value);
    }
}

class Logger {
    log(errorText) {
        console.log(errorText); // Varsayılan olarak konsola yazdır
    }
}

class ConsoleLogger extends Logger {
    log(errorText) {
        console.log(errorText); // Hataları konsola yazdırır
    }
}

class AlertLogger extends Logger {
    log(errorText) {
        alert(errorText); // Hataları alert olarak gösterir
    }
}

class DomLogger extends Logger {
    log(errorText) {
        const errorContainer = document.getElementById('errorContainer');
        const errorDiv = document.createElement('div');
        errorDiv.textContent = errorText; // Hata mesajını ekle
        errorDiv.style.color = "red"; // Hata mesajına stil ekleyin (isteğe bağlı)
        errorContainer.appendChild(errorDiv); // Hata mesajını ekle
    }

    clear() {
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerHTML = ''; // Önceki hataları temizle
    }
}

class Validator {
    constructor(logger, rules) {
        this.logger = logger;
        this.rules = rules;
    }

    validate(form) {
        let isValid = true;

        // Eski hataları temizle
        if (this.logger.clear) {
            this.logger.clear();
        }

        // Her kuralı doğrula
        this.rules.forEach(rule => {
            const value = form[rule.username] ? form[rule.username].value : '';
            if (!rule.isValid(value)) {
                this.logger.log(rule.errorText); // Hataları logger'a kaydet
                isValid = false;
            }
        });

        return isValid;
    }
}
class Processor {
    constructor(validator, success) {
        this.validator = validator;
        this.success = success;
    }

    attach(formSelector) {
        const form = document.querySelector(formSelector);
        form.onsubmit = (event) => {
            event.preventDefault();

            if (this.validator.validate(form)) {
                this.success(form);
            }
        };
    }
}

// Kurallar
const usernameRule = new Rule(
    'username',
    'Username must be between 5 and 15 characters and contain only letters.',
    (value) => /^[A-Za-z]{5,15}$/.test(value)
);

const birthYearRule = new Rule(
    'birthYear',
    'Birth year must be between 1900 and the current year.',
    (value) => value >= 1900 && value <= new Date().getFullYear()
);

const eyeColorRule = new Rule(
    'eyeColor',
    'Eye color must be one of: brown, green, gray, blue.',
    (value) => ['brown', 'green', 'gray', 'blue'].includes(value)
);

const hairColorRule = new Rule(
    'hairColor',
    'Hair color must be one of: black, brown, white, red, other.',
    (value) => ['black', 'brown', 'white', 'red', 'other'].includes(value)
);

const heightRule = new Rule(
    'height',
    'Height must be between 0 and 2.60 meters.',
    (value) => value >= 0 && value <= 2.60
);

const weightRule = new Rule(
    'weight',
    'Weight must be between 0 and 300 kilograms.',
    (value) => value >= 0 && value <= 300
);

// Logger Instances
const consoleLogger = new ConsoleLogger(); // ConsoleLogger tanımlandı
const alertLogger = new AlertLogger();
const domLogger = new DomLogger();

// Validator Instance
const rules = [usernameRule, birthYearRule, eyeColorRule, hairColorRule, heightRule, weightRule];
const validator = new Validator(domLogger, rules); // ConsoleLogger kullanılıyor

// Başarı Fonksiyonu
const successFunction = (form) => {
    alert('Form submitted successfully!');
    form.reset();  // Formu sıfırla
};

// Processor Instance
const processor = new Processor(validator, successFunction);

// Forma Bağla
processor.attach('#myForm');
