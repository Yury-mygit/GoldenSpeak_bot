export const terms = "Политика безопасности при оплате\n" +
    "При оплате заказа банковской картой, обработка платежа (включая ввод номера карты) происходит на защищенной странице процессинговой системы, которая прошла международную сертификацию. Это значит, что Ваши конфиденциальные данные (реквизиты карты, регистрационные данные и др.) не поступают в интернет-магазин, их обработка полностью защищена и никто, в том числе наш интернет-магазин, не может получить персональные и банковские данные клиента. При работе с карточными данными применяется стандарт защиты информации, разработанный международными платёжными системами Visa и Masterсard-Payment Card Industry Data Security Standard (PCI DSS), что обеспечивает безопасную обработку реквизитов Банковской карты Держателя. Применяемая технология передачи данных гарантирует безопасность по сделкам с Банковскими картами путем использования протоколов Secure Sockets Layer (SSL), Verifiedby Visa, Secure Code, и закрытых банковских сетей, имеющих высшую степень защиты.\n" +
    "\n" +
    "Политика возврата платежей\n" +
    "Уважаемые Клиенты, информируем Вас о том, что при запросе возврата денежных средств при отказе от покупки, возврат производится исключительно на ту же банковскую карту, с которой была произведена оплата."
export const about = "Контакты\n" +
    "Телефон: +7 917-567-86-22\n" +
    "E-mail: goldenspeak@mail.ru\n" +
    "Сайт: https://goldenspeak.ru/\n" +
    "Адрес: г.Москва, ул. Старослободская д.16/17\n" +
    "\n" +
    "Время работы: ежедневно с 9.00 до 21.00\n" +
    "Посещение по предварительной записи"



export const userCommands = [
    { command: 'start', description: 'Начать работу с ботом' },
    { command: 'pay', description: 'Оплатить занятия' },
    { command: 'about', description: 'Узнать о нас' },
    { command: 'terms', description: 'Правила использования' },
    { command: 'view', description: 'вид' },
];


export let paymentOptions = [
    { label: '1 занятие', amount: 110000 , type :'office'},
    { label: '4 занятия', amount: 410000 , type :'office'},
    { label: '8 занятий', amount: 760000 , type :'office'},
    // { label: 'Индивидуальное занятие', amount: 110000 , type :'online'},
    // { label: 'Абонемент 4 занятия', amount: 410000 , type :'office'},
    // { label: 'Абонемент 8 занятий', amount: 760000 , type :'office'},
    // { label: 'тестовый товар', amount: 1000 , type :'test'},

];


// async function fetchPaymentOptions() {
//     try {
//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => controller.abort(), 2000);
//
//         const response = await fetch('http://localhost:3002', { signal: controller.signal });
//         clearTimeout(timeoutId);
//
//         if (!response.ok) throw new Error('Network response was not ok.');
//
//         const data = await response.json();
//         paymentOptions = data; // Update payment options with data from the server
//     } catch (error) {
//         console.error('Failed to fetch payment options:', error);
//         // If there's an error or timeout, keep the default paymentOptions
//     }
// }
// start - Начать работу с ботом
// pay - Оплатить занятия
// about - Узнать о нас
// terms - Правила использования