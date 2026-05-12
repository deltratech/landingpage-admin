//index page data
export const pagesData = [
    {
        url: 'https://onion.com',
        clicks: 1369,
        clickChange: -165,
        views: '50M',
        changeType: 'error'
    },
    {
        url: 'https://onion/analytic.com',
        clicks: 1003,
        clickChange: 528,
        views: '28M',
        changeType: 'success'
    },
    {
        url: 'https://onion/ecommerce.com',
        clicks: 1987,
        clickChange: 898,
        views: '63M',
        changeType: 'success'
    },
    {
        url: 'https://onion/crm.com',
        clicks: 1462,
        clickChange: -369,
        views: '50M',
        changeType: 'error'
    },
    {
        url: 'https://onion/finance.com',
        clicks: 986,
        clickChange: -479,
        views: '70M',
        changeType: 'error'
    },
    {
        url: 'https://onion/projectm.com',
        clicks: 1028,
        clickChange: 669,
        views: '75M',
        changeType: 'success'
    },
    {
        url: 'https://onion/logistics.com',
        clicks: 369,
        clickChange: 215,
        views: '25M',
        changeType: 'success'
    }
];
//dashboard analytics data
export const tabs = [
    {
        id: 'basic-tabs-1',
        title: 'Users',
        value: '12,060',
        percentage: '+12.5%',
        percentageClass: 'text-success-500'
    },
    {
        id: 'basic-tabs-2',
        title: 'Sessions',
        value: '30,000',
        percentage: '+5.56%',
        percentageClass: 'text-success-500'
    },
    {
        id: 'basic-tabs-3',
        title: 'Bounce Rate',
        value: '53%',
        percentage: '-1.5%',
        percentageClass: 'text-error-500'
    },
    {
        id: 'basic-tabs-4',
        title: 'Session Duration',
        value: '3m 10s',
        percentage: '-10.5%',
        percentageClass: 'text-error-500'
    }
];

export const dealForecasts = [
    {
        name: 'Astole Banne',
        dealWon: '$25,000',
        totalDeal: '$25,360',
        imgSrc: 'assets/images/user/user-11.png'
    },
    {
        name: 'Jhone Abela',
        dealWon: '$25,000',
        totalDeal: '$25,360',
        imgSrc: 'assets/images/user/user-16.png'
    },
    {
        name: 'Lisa Been',
        dealWon: '$25,000',
        totalDeal: '$25,360',
        imgSrc: 'assets/images/user/user-17.png'
    }
];

export const dealData = [
    {
        representative: {
            name: 'Astole Banne',
            title: 'Sales Manager',
            image: 'assets/images/user/user-11.png'
        },
        company: 'Absternet LLC',
        status: 'Deal won',
        value: '203.50K',
        statusClass: 'bg-success-50 text-success-500',
        textColor: 'text-gray-900 dark:text-white'
    },
    {
        representative: {
            name: 'Lisa Bee',
            title: 'Sales Manager',
            image: 'assets/images/user/user-11.png'
        },
        company: 'Nike',
        status: 'Stuck',
        value: '283.50K',
        statusClass: 'bg-error-50 text-error-500',
        textColor: 'text-gray-900 dark:text-white'
    },
    {
        representative: {
            name: 'Stuward Canne',
            title: 'Sales Manager',
            image: 'assets/images/user/user-11.png'
        },
        company: 'Absternet LLC',
        status: 'Pending',
        value: '203.50K',
        statusClass: 'dark:bg-gray-700 text-warning-500',
        textColor: 'text-gray-900 dark:text-white'
    }
];

export const leadData = [
    {
        type: 'Email',
        icon: 'ri-mail-line',
        count: '500 vs 1000',
        percentage: '60%',
        iconColor: 'text-primary-500'
    },
    {
        type: 'Call',
        icon: 'ri-phone-line',
        count: '360 vs 965',
        percentage: '10%',
        iconColor: 'text-success-500'
    },
    {
        type: 'Social',
        icon: 'ri-user-line',
        count: '3684 vs 5000',
        percentage: '20%',
        iconColor: 'text-gray-500'
    },
    {
        type: 'Other',
        icon: 'svg-icon', // Use a different way to handle SVG icons
        count: '469 vs 678',
        percentage: '10%',
        iconColor: 'fill-gray-300'
    }
];
export const leads = [
    {
        name: 'Astole Banne',
        email: 'astole@gmail.com',
        img: 'assets/images/user/user-11.png',
        amount: '$25,360.00',
        status: 'Won Lead',
        statusClass: 'bg-success-50 text-success-600'
    },
    {
        name: 'Taslon Abela',
        email: 'taslon@gmail.com',
        img: 'assets/images/user/user-17.png',
        amount: '$25,360.00',
        status: 'Cold Lead',
        statusClass: 'bg-warning-50 text-warning-600'
    },
    {
        name: 'Tofan Andy',
        email: 'tofan@gmail.com',
        img: 'assets/images/user/user-18.png',
        amount: '$25,360.00',
        status: 'New Lead',
        statusClass: 'bg-error-50 text-error-600'
    }
];

// dashboard ecommerce
export const orders = [
    {
        id: '#4zd8S',
        method: 'PayPal',
        status: 'Pending',
        statusClass: 'text-warning-600',
        statusBg: 'dark:bg-gray-700',
        image: 'assets/images/payment/paypal.svg',
        created: 'about 2 hours ago',
        total: '$678.5'
    },
    {
        id: '#SPCTt',
        method: 'Card',
        status: 'Shipped',
        statusClass: 'text-success-600',
        statusBg: 'bg-success-50',
        image: 'assets/images/payment/master-card.svg',
        created: 'about 2 hours ago',
        total: '$165.58'
    },
    {
        id: '#tO4V-',
        method: 'Skrill',
        status: 'Confirmed',
        statusClass: 'text-primary-600',
        statusBg: 'bg-primary-50',
        image: 'assets/images/payment/skrill.svg',
        created: 'about 2 hours ago',
        total: '$463.25'
    },
    {
        id: '#K6jyV',
        method: 'Visa Card',
        status: 'Rejected',
        statusClass: 'text-error-600',
        statusBg: 'bg-error-50',
        image: 'assets/images/payment/visa-2.svg',
        created: 'about 2 hours ago',
        total: '$363.25'
    }
];
export const reviewStats = [
    { rating: '5 Star', percentage: 50, widthClass: 'w-full' },
    { rating: '4 Star', percentage: 40, widthClass: 'w-8/12' },
    { rating: '3 Star', percentage: 30, widthClass: 'w-8/12' },
    { rating: '2 Star', percentage: 20, widthClass: 'w-4/12' },
    { rating: '1 Star', percentage: 10, widthClass: 'w-3/12' }
];
export const products = [
    {
        name: 'Apple Watch',
        code: '#FEIF_U',
        price: '$1,799',
        sold: '2,389 pcs',
        sales: '$17,689',
        imgSrc: 'assets/images/products/apple-watch.png',
        alt: 'Apple Watch'
    },
    {
        name: 'Nike Shoes',
        code: '#wkqUbj',
        price: '$739',
        sold: '6,698 pcs',
        sales: '$62,397',
        imgSrc: 'assets/images/products/shoe-1.png',
        alt: 'Nike Shoes'
    },
    {
        name: 'Ribbon Glass',
        code: '#Ou4fxo',
        price: '$245',
        sold: '300 pcs',
        sales: '$7,658',
        imgSrc: 'assets/images/products/sunglass.png',
        alt: 'Ribbon Glass'
    },
    {
        name: 'Headset',
        code: '#Hey3HG',
        price: '$139',
        sold: '2,389 pcs',
        sales: '$6,658',
        imgSrc: 'assets/images/products/headset.png',
        alt: 'Headset'
    }
];
export const topSellers = [
    {
        name: 'Gage Paquette',
        earnings: '$350K',
        itemsSold: '13,440',
        imgSrc: 'assets/images/user/user-11.png',
        flagSrc: 'assets/images/flags/usa-round.png',
        flagAlt: 'usa'
    },
    {
        name: 'Lara Harvey',
        earnings: '$148K',
        itemsSold: '10,240',
        imgSrc: 'assets/images/user/user-16.png',
        flagSrc: 'assets/images/flags/uk-round.png',
        flagAlt: 'uk'
    },
    {
        name: 'Evan Scott',
        earnings: '$148K',
        itemsSold: '10,240',
        imgSrc: 'assets/images/user/user-17.png',
        flagSrc: 'assets/images/flags/germany-round.png',
        flagAlt: 'germany'
    },
    {
        name: 'Benja Johnston',
        earnings: '$148K',
        itemsSold: '13,440',
        imgSrc: 'assets/images/user/user-18.png',
        flagSrc: 'assets/images/flags/spain-round.png',
        flagAlt: 'spain'
    }
];

// dashboard logistics
export const transportations = [
    {
        type: 'Ships',
        image: 'assets/images/transportation/1.png',
        count: '500 ships',
        tons: '5,03,68,258'
    },
    {
        type: 'Planes',
        image: 'assets/images/transportation/2.png',
        count: '25 planes',
        tons: '23,36,569'
    },
    {
        type: 'Trucks',
        image: 'assets/images/transportation/3.png',
        count: '2500 Trucks',
        tons: '3,65,66,547'
    },
    {
        type: 'Trains',
        image: 'assets/images/transportation/4.png',
        count: '1000 trains',
        tons: '1,02,36,482'
    }
];
export const shipments = [
    {
        name: 'Apple Watch',
        id: '#2nwyIZT4NB',
        clientName: 'Astole Banne',
        price: '$560.00',
        address: 'Rome, Italy.',
        status: 'Delivered',
        statusClass: 'bg-success-50 text-success-600',
        imagePath: 'assets/images/products/apple-watch.png'
    },
    {
        name: 'Nike Shoes',
        id: '#AWlad2dGlu',
        clientName: 'Talon Abela',
        price: '$250.50',
        address: 'Bangkok, Singapore',
        status: 'Shipping',
        statusClass: 'bg-primary-50 text-primary-600',
        imagePath: 'assets/images/products/shoe-1.png'
    },
    {
        name: 'Ribbon Glass',
        id: '#4ImWEnfPKm',
        clientName: 'Tofan Andy',
        price: '$150.25',
        address: 'Paris, France',
        status: 'Delayed',
        statusClass: 'bg-error-50 text-error-600',
        imagePath: 'assets/images/products/sunglass.png'
    },
    {
        name: 'Apple Watch',
        id: '#AGFWcs-QXe',
        clientName: 'Jhon Ables',
        price: '$799.25',
        address: 'New York, USA',
        status: 'Delivered',
        statusClass: 'bg-success-50 text-success-600',
        imagePath: 'assets/images/products/headset.png'
    }
];
export const roles = [
    {
        title: 'Material sourcing',
        description: 'Material sourcing involves',
        imgSrc: 'assets/images/role/1.png'
    },
    {
        title: 'Transportation',
        description: 'The best carrier based cost',
        imgSrc: 'assets/images/role/2.png'
    },
    {
        title: 'Order fulfillment',
        description: 'The process comprise order',
        imgSrc: 'assets/images/role/3.png'
    },
    {
        title: 'Warehousing',
        description: 'Planners consider warehouse',
        imgSrc: 'assets/images/role/4.png'
    },
    {
        title: 'Supply management',
        description: 'Logistics is an important link',
        imgSrc: 'assets/images/role/5.png'
    }
];
export const visitsByCountry = [
    {
        country: 'USA',
        flag: 'assets/images/flags/usa-round.png',
        percentage: '30% visits',
        totalVisits: '68,258',
        change: '4.67',
        changeColor: 'text-success-500'
    },
    {
        country: 'UK',
        flag: 'assets/images/flags/uk-round.png',
        percentage: '20% visits',
        totalVisits: '50,683',
        change: '2.59',
        changeColor: 'text-success-500'
    },
    {
        country: 'Germany',
        flag: 'assets/images/flags/germany-round.png',
        percentage: '28% visits',
        totalVisits: '62,053',
        change: '-1.18',
        changeColor: 'text-error-500'
    },
    {
        country: 'Spain',
        flag: 'assets/images/flags/spain-round.png',
        percentage: '18% visits',
        totalVisits: '40,369',
        change: '-2.98',
        changeColor: 'text-error-500'
    },
    {
        country: 'China',
        flag: 'assets/images/flags/china-round.png',
        percentage: '4% visits',
        totalVisits: '3,258',
        change: '1.22',
        changeColor: 'text-success-500'
    }
];

//dashboard marketnig
export const socialMediaData = [
    {
        id: 1,
        name: 'Twitter',
        category: 'Social Media',
        iconPath: 'assets/images/social-media/twitter.svg',
        percentage: 4.67,
        isPositive: true
    },
    {
        id: 2,
        name: 'Linked In',
        category: 'Social Media',
        iconPath: 'assets/images/social-media/027-linkedin.svg',
        percentage: -3.37,
        isPositive: false
    },
    {
        id: 3,
        name: 'Dribble',
        category: 'Community',
        iconPath: 'assets/images/social-media/dribble.svg',
        percentage: 2.19,
        isPositive: true
    },
    {
        id: 4,
        name: 'Facebook',
        category: 'Social Media',
        iconPath: 'assets/images/social-media/036-facebook.svg',
        percentage: -2.68,
        isPositive: false
    },
    {
        id: 5,
        name: 'Instagram',
        category: 'Community',
        iconPath: 'assets/images/social-media/029-instagram.svg',
        percentage: 3.33,
        isPositive: true
    }
];

export const eventData = [
    {
        name: 'Valentine Day',
        date: '14th February, 2022',
        thumbnail: 'assets/images/thumbnail/6.png',
        members: ['assets/images/user/user-11.png', 'assets/images/user/user-10.png', 'assets/images/user/user-13.png'],
        extraMembers: 2,
        status: 'Live Now',
        statusClass: 'bg-success-50 text-success-500',
        duration: '14 Feb - 21 Feb, 2022'
    },
    {
        name: 'Mother’s Day',
        date: '2nd April, 2022',
        thumbnail: 'assets/images/thumbnail/5.png',
        members: ['assets/images/user/user-11.png', 'assets/images/user/user-10.png', 'assets/images/user/user-13.png'],
        extraMembers: 2,
        status: 'Reviewing',
        statusClass: 'bg-primary-50 text-primary-500',
        duration: '2 Apr - 5 Apr, 2022'
    },
    {
        name: 'Cyber Monday',
        date: '17th January, 2022',
        thumbnail: 'assets/images/thumbnail/4.png',
        members: ['assets/images/user/user-11.png', 'assets/images/user/user-10.png', 'assets/images/user/user-13.png'],
        extraMembers: 2,
        status: 'Paused',
        statusClass: 'bg-warning-50 text-warning-600',
        duration: '17 Jan - 21 Jan, 2022'
    },
    {
        name: 'Valentine Day',
        date: '14th February, 2022',
        thumbnail: 'assets/images/thumbnail/6.png',
        members: ['assets/images/user/user-11.png', 'assets/images/user/user-10.png', 'assets/images/user/user-13.png'],
        extraMembers: 2,
        status: 'Live Now',
        statusClass: 'bg-success-50 text-success-500',
        duration: '14 Feb - 21 Feb, 2022'
    }
];

//dashboard finance
export const currencies = [
    {
        name: 'USD',
        percentage: '94.65%',
        change: '+2.5%',
        changeClass: 'text-success-500',
        iconClass: 'fill-primary-500',
        svgPath: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z'
    },
    {
        name: 'EURO',
        percentage: '26.37%',
        change: '-1.56%',
        changeClass: 'text-error-500',
        iconClass: 'fill-success-500',
        svgPath: 'M15 18.5c-2.51 0-4.68-1.42-5.76-3.5H15l1-2H8.58c-.05-.33-.08-.66-.08-1s.03-.67.08-1H15l1-2H9.24C10.32 6.92 12.5 5.5 15 5.5c1.61 0 3.09.59 4.23 1.57L21 5.3C19.41 3.87 17.3 3 15 3c-3.92 0-7.24 2.51-8.48 6H3l-1 2h4.06c-.04.33-.06.66-.06 1s.02.67.06 1H3l-1 2h4.52c1.24 3.49 4.56 6 8.48 6 2.31 0 4.41-.87 6-2.3l-1.78-1.77c-1.13.98-2.6 1.57-4.22 1.57z'
    },
    {
        name: 'GBP',
        percentage: '55.24%',
        change: '+3.23%',
        changeClass: 'text-success-500',
        iconClass: 'fill-warning-500',
        svgPath: 'M14 21c1.93 0 3.62-1.17 4-3l-1.75-.88C16 18.21 15.33 19 14 19H9.1c.83-1 1.5-2.34 1.5-4 0-.35-.03-.69-.08-1H14v-2H9.82C9 10.42 8 9.6 8 8c0-1.93 1.57-3.5 3.5-3.5 1.5 0 2.79.95 3.28 2.28L16.63 6c-.8-2.05-2.79-3.5-5.13-3.5C8.46 2.5 6 4.96 6 8c0 1.78.79 2.9 1.49 4H6v2h2.47c.08.31.13.64.13 1 0 2.7-2.6 4-2.6 4v2h8z'
    }
];
export const transactions = [
    {
        name: 'Arikunn',
        code: 'sbACR356LD',
        date: '31 Aug, 2022',
        time: '10:30 AM',
        amount: '$356.25',
        image: 'assets/images/user/user-13.png'
    },
    {
        name: 'Ikauwis',
        code: 'iziiMXDtjF',
        date: '30 Aug, 2022',
        time: '01:30 PM',
        amount: '$165.58',
        image: 'assets/images/user/user-14.png'
    },
    {
        name: 'Dayet',
        code: 'Bfe_Rnaj3d',
        date: '29 Aug, 2022',
        time: '07:30 PM',
        amount: '$463.25',
        image: 'assets/images/user/user-15.png'
    },
    {
        name: 'Ikauwis',
        code: '3a2QN5oaji',
        date: '28 Aug, 2022',
        time: '04:30 PM',
        amount: '$185.58',
        image: 'assets/images/user/user-13.png'
    }
];
export const items = [
    {
        id: 1,
        amount: '$23,560',
        category: 'Emergency',
        iconColor: 'text-primary-500',
        svgPath: 'M11.0533 12.9687C11.5065 12.9687 11.8736 12.6009 11.8736 12.1484V11.726C12.7907 11.5294 13.4408 10.966 13.5893 10.1087C13.8963 8.33357 12.1936 7.84508 11.2789 7.58381L11.0514 7.51843C10.0771 7.23477 10.1018 7.0666 10.1346 6.91894C10.191 6.59853 10.815 6.52031 11.3761 6.6062C11.6056 6.64081 11.8572 6.72154 12.0976 6.80488C12.5237 6.95229 12.9929 6.72539 13.1414 6.29875C13.2901 5.87054 13.0639 5.40297 12.6357 5.25408C12.3396 5.1522 12.098 5.08682 11.8745 5.0378V4.60156C11.8745 4.14916 11.5072 3.78125 11.0541 3.78125C10.601 3.78125 10.2338 4.14912 10.2338 4.60156V5.01139C9.31426 5.20859 8.66621 5.78281 8.51855 6.64004C8.21094 8.39551 9.87617 8.88359 10.5529 9.09277L10.7913 9.16201C11.9922 9.50551 11.9726 9.62097 11.9365 9.82974C11.9146 10.151 11.2912 10.233 10.7293 10.1428C10.4463 10.1018 10.0812 9.97051 9.75723 9.85566L9.57676 9.79004C9.1502 9.64238 8.67852 9.86387 8.53086 10.2904C8.3791 10.717 8.60058 11.1846 8.99434 11.3363L9.16931 11.3979C9.48751 11.5122 9.84114 11.6271 10.1972 11.706V12.1484C10.233 12.5996 10.598 12.9687 11.0533 12.9687ZM20.0562 9.28555C19.7181 9.28555 19.3906 9.40412 19.1309 9.62056L12.6956 14.9854C11.7654 15.7606 10.2429 15.761 9.31221 14.9855L2.8707 9.61777C2.61099 9.40133 2.28336 9.28276 1.94539 9.28276C1.14723 9.28555 0.5 9.92949 0.5 10.7293V18.875C0.5 20.3228 1.6751 21.5 3.125 21.5H18.875C20.3249 21.5 21.5 20.3241 21.5 18.8746V10.7293C21.5 9.92949 20.852 9.28555 20.0562 9.28555ZM19.5312 18.875C19.5312 19.2368 19.2368 19.5312 18.875 19.5312H3.125C2.76316 19.5312 2.46875 19.2368 2.46875 18.875V11.849L8.05098 16.5002C8.87949 17.1852 9.92539 17.5666 11 17.5666C12.0746 17.5666 13.1226 17.1883 13.9519 16.4994L19.5312 11.849V18.875ZM5.09375 9.76543V2.79687C5.09375 2.61616 5.24116 2.46875 5.42187 2.46875H16.5781C16.7588 2.46875 16.9062 2.61616 16.9062 2.79687V9.76133L18.2893 8.60879C18.4689 8.46113 18.6658 8.34629 18.875 8.24785V2.79687C18.875 1.53031 17.8455 0.5 16.5781 0.5H5.42187C4.15572 0.5 3.125 1.53031 3.125 2.79687V8.24785C3.3327 8.3467 3.53274 8.46236 3.71152 8.61137L5.09375 9.76543Z'
    },
    {
        id: 2,
        amount: '$19,489',
        category: 'Health',
        iconColor: 'text-success-500',
        svgPath: 'M11.813 2.63311L9.88074 4.64749L7.83178 2.64686C6.59584 1.43583 4.62709 1.34164 3.46079 2.29899L3.45095 2.30724C1.93319 3.53374 1.85663 5.7303 3.20559 7.0503H3.20668L9.84792 13.4784L10.0958 13.2653C10.2745 13.8428 10.5443 14.3825 10.887 14.8706L10.6865 15.0666C10.2125 15.51 9.45053 15.51 9.01303 15.0666L1.94777 8.19843C-0.0913388 6.20468 0.0176716 2.90811 2.31199 1.05461C4.101 -0.413891 6.76355 -0.290484 8.60105 1.0632C8.78334 1.19727 8.92553 1.34336 9.1224 1.50114L9.84792 2.22199L10.5406 1.50114C10.712 1.33752 10.8906 1.18627 11.0802 1.04842C12.9104 -0.291172 15.5391 -0.408734 17.3875 1.05461C18.9516 2.34092 19.4839 4.31749 18.9844 6.07405C18.463 5.8128 17.9016 5.6753 17.3146 5.58249C17.6135 4.43093 17.2599 3.1453 16.25 2.30861C14.9958 1.3272 13.0635 1.4513 11.813 2.63311ZM11 11.55C11 8.81718 13.3516 6.56905 16.25 6.56905C19.1484 6.56905 21.5 8.81718 21.5 11.55C21.5 14.2828 19.1484 16.5 16.25 16.5C13.3516 16.5 11 14.2828 11 11.55ZM16.8333 9.31948C16.8333 9.76991 17.2119 10.1484 17.6622 10.1484C18.1127 10.1484 18.4915 9.76991 18.4915 9.31948C18.4915 8.86905 18.1127 8.49051 17.6622 8.49051C17.2119 8.49051 16.8333 8.86905 16.8333 9.31948ZM14.5301 9.31948C14.5301 9.76991 14.9087 10.1484 15.359 10.1484C15.8094 10.1484 16.1882 9.76991 16.1882 9.31948C16.1882 8.86905 15.8094 8.49051 15.359 8.49051C14.9087 8.49051 14.5301 8.86905 14.5301 9.31948Z'
    },
    {
        id: 3,
        amount: '$18,889',
        category: 'Investment',
        iconColor: 'text-error-500',
        svgPath: 'M2.25 13.2C2.25 13.5025 2.51104 13.75 2.83333 13.75H10.238C10.5187 14.3516 10.8687 14.9084 11.299 15.4H2.83333C1.54453 15.4 0.5 14.4134 0.5 13.2V5.4175C0.5 5.10812 0.568505 4.80562 0.701104 4.52375L2.21755 1.30659C2.59198 0.511844 3.4276 0 4.35 0H12.9833C13.9057 0 14.7406 0.512187 15.1161 1.30659L16.6328 4.52375C16.7641 4.80562 16.8333 5.10812 16.8333 5.4175V5.52406C16.6401 5.50687 16.4469 5.5 16.25 5.5C15.2948 5.5 14.387 5.69594 13.574 6.05H2.25V13.2ZM12.9833 1.65H9.54167V4.4H14.6604L13.5156 1.97656C13.4245 1.77787 13.213 1.65 12.9833 1.65ZM2.67437 4.4H7.79167V1.65H4.35C4.11922 1.65 3.91031 1.77787 3.81661 1.97656L2.67437 4.4ZM21.5 11.55C21.5 14.2828 19.1484 16.5 16.25 16.5C13.3516 16.5 11 14.2828 11 11.55C11 8.81719 13.3516 6.6 16.25 6.6C19.1484 6.6 21.5 8.81719 21.5 11.55ZM17.8797 10.0616L15.6667 12.1481L14.6203 11.1616C14.3943 10.945 14.0224 10.945 13.7964 11.1616C13.5667 11.3747 13.5667 11.7253 13.7964 11.9384L15.2547 13.3134C15.4807 13.53 15.8526 13.53 16.0786 13.3134L18.7036 10.8384C18.9333 10.6253 18.9333 10.2747 18.7036 10.0616C18.4776 9.845 18.1057 9.845 17.8797 10.0616Z'
    },
    {
        id: 4,
        amount: '$21,489',
        category: 'Education',
        iconColor: 'text-warning-500',
        svgPath: 'M18.3733 19.5312C18.4858 15.9403 15.9288 12.9646 12.5409 12.3125L9.18581 16.7873L5.83073 12.3125C2.44284 12.9277 -0.100129 15.9403 0.0106132 19.5312C0.0106132 20.6186 0.879324 21.5 1.96665 21.5H16.4041C17.4915 21.5 18.3733 20.6182 18.3733 19.5312ZM1.981 19.5312L1.97908 19.4696C1.91116 17.2994 3.16361 15.3951 5.07207 14.5805L8.78385 19.5312H1.981ZM16.3923 19.5312H9.58776L13.3001 14.5807C15.2085 15.394 16.4607 17.2984 16.3931 19.4697L16.3923 19.5312ZM0.557352 3.771L0.818621 3.83252V6.23193C0.531512 6.40215 0.326434 6.70566 0.326434 7.0625C0.326434 7.40601 0.516131 7.69332 0.782527 7.87256L0.141863 10.4258C0.0700859 10.7088 0.229227 11 0.454813 11H2.16721C2.3928 11 2.55174 10.7078 2.47996 10.4627L1.83909 7.87461C2.10569 7.69414 2.29518 7.40703 2.29518 7.0625C2.29518 6.70361 2.09011 6.40133 1.803 6.23193V4.07369L3.93581 4.58639V6.40625C3.93581 9.3081 6.28395 11.6193 9.18581 11.6193C12.0877 11.6193 14.4358 9.31016 14.4358 6.40625V4.58598L17.8093 3.771C18.5579 3.59155 18.5579 2.66357 17.8093 2.479L9.99997 0.592285C9.73542 0.530762 9.46061 0.5 9.18991 0.5C8.91921 0.5 8.6444 0.530762 8.3778 0.592285L0.560223 2.479C-0.186262 2.65865 -0.186262 3.59176 0.557352 3.771ZM5.90456 5.06094L8.36878 5.65648C8.90198 5.77953 9.46061 5.77953 9.99423 5.65648L12.4671 5.06094V6.40625C12.4671 8.21504 10.9946 9.6875 9.18581 9.6875C7.37702 9.6875 5.90456 8.21504 5.90456 6.40625V5.06094Z'
    }
];

//dashboard finance 2
export const itemsfinance2 = [
    {
        image: 'assets/images/thumbnail/1.png',
        name: 'Arikunn',
        code: 'cKwvkYhL00',
        date: '31 Aug, 2022',
        amount: '$356.25'
    },
    {
        image: 'assets/images/thumbnail/2.png',
        name: 'Ikauwis',
        code: 'P3eW3taO2j',
        date: '30 Aug, 2022',
        amount: '$165.58'
    },
    {
        image: 'assets/images/thumbnail/3.png',
        name: 'Dayet',
        code: 'NSwrhYn8En',
        date: '29 Aug, 2022',
        amount: '$463.25'
    }
];
export const users = ['assets/images/user/user-11.png', 'assets/images/user/user-13.png', 'assets/images/user/user-14.png', 'assets/images/user/user-13.png', 'assets/images/user/user-11.png'];
export const transactionsFinance = [
    {
        image: 'assets/images/user/user-13.png',
        name: 'Arikunn',
        code: 'sbACR356LD',
        date: '31 Aug, 2022',
        time: '10:30 AM',
        amount: '$356.25',
        isOdd: true
    },
    {
        image: 'assets/images/user/user-14.png',
        name: 'Ikauwis',
        code: 'iziiMXDtjF',
        date: '30 Aug, 2022',
        time: '01:30 PM',
        amount: '$165.58',
        isOdd: false
    },
    {
        image: 'assets/images/user/user-15.png',
        name: 'Dayet',
        code: 'Bfe_Rnaj3d',
        date: '29 Aug, 2022',
        time: '07:30 PM',
        amount: '$463.25',
        isOdd: true
    },
    {
        image: 'assets/images/user/user-13.png',
        name: 'Ikauwis',
        code: '3a2QN5oaji',
        date: '28 Aug, 2022',
        time: '04:30 PM',
        amount: '$185.58',
        isOdd: false
    }
];

//account page data
export const activityData = [
    {
        browser: 'Chrome on Windows',
        device: 'Dell XPS 12',
        location: 'New York, USA',
        activity: 'Now',
        imgSrc: '/assets/images/profile-page/chrome.svg',
        status: 'Success'
    },
    {
        browser: 'Mozilla Firefox',
        device: 'Acer Aspire 300',
        location: 'New York, USA',
        activity: '15 June 2020',
        imgSrc: '/assets/images/profile-page/mozilla.svg'
    },
    {
        browser: 'Safari Browser',
        device: 'Macbook Pro 2020',
        location: 'London, UK',
        activity: '05 October 2020',
        imgSrc: '/assets/images/profile-page/apple.svg'
    },
    {
        browser: 'Apple Browser',
        device: 'IPhone 13 Pro Max',
        location: 'Manchester, UK',
        activity: '05 October 2000',
        imgSrc: '/assets/images/profile-page/apple.svg'
    }
];
export const notifications = [
    {
        type: 'New for you',
        email1: true,
        email2: false,
        app: false
    },
    {
        type: 'Account activity',
        email1: true,
        email2: true,
        app: true
    },
    {
        type: 'A new browser used to sign in',
        email1: true,
        email2: true,
        app: true
    },
    {
        type: 'A new device is linked',
        email1: false,
        email2: true,
        app: false
    },
    {
        type: 'A new device connected',
        email1: true,
        email2: false,
        app: false
    }
];
export const accounts = [
    {
        name: 'Facebook',
        description: 'Plan properly your workflow',
        imgSrc: 'assets/images/profile-page/f.svg',
        connected: true
    },
    {
        name: 'Twitter',
        description: 'Keep eye on your Repositories',
        imgSrc: 'assets/images/profile-page/t.svg',
        connected: true
    },
    {
        name: 'Instagram',
        description: 'Keep up with the stories',
        imgSrc: 'assets/images/profile-page/i.svg',
        connected: true
    },
    {
        name: 'Sound Cloud',
        description: 'Playlist to get you by',
        imgSrc: 'assets/images/profile-page/cloud.svg',
        connected: true
    }
];
export const socialAccounts = [
    {
        name: 'Facebook',
        img: 'assets/images/profile-page/f.svg',
        link: 'www.facebook.com/ui-lib',
        connected: true
    },
    {
        name: 'Twitter',
        img: 'assets/images/profile-page/t.svg',
        link: 'www.twitter.com/ui-lib',
        connected: true
    },
    {
        name: 'Linkedin',
        img: 'assets/images/profile-page/in.svg',
        link: 'www.linkedin.com/ui-lib',
        connected: true
    },
    {
        name: 'Skype',
        img: 'assets/images/profile-page/sky.svg',
        link: 'www.skype.com/ui-lib',
        connected: false
    }
];
export const accountTabitems = [
    {
        value: '$85,460',
        description: 'Net Earnings',
        iconPath: 'M10.15,9.44a.48.48,0,0,1,.7,0l2.65,2.65,6.94-6.94a.5.5,0,0,1,.71,0l.7.7a.5.5,0,0,1,0,.71l-8,8a.48.48,0,0,1-.7,0L10.5,11.91,3.56,18.85a.5.5,0,0,1-.71,0l-.7-.7a.5.5,0,0,1,0-.71Z',
        color: 'fill-primary-500 '
    },
    {
        value: '$44,550',
        description: 'Balance',
        iconPath: 'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM13,7V6.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V7A2,2,0,0,0,9,9v.81a2,2,0,0,0,.73,1.54l3.43,2.83a.22.22,0,0,1,.09.19v.88h-2.5v-1a.5.5,0,0,0-.5-.5H9.5a.5.5,0,0,0-.5.5V15a2,2,0,0,0,2,2v.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V17a2,2,0,0,0,2-2v-.81a2,2,0,0,0-.73-1.54L10.84,9.82a.22.22,0,0,1-.09-.19V8.75h2.5v1a.5.5,0,0,0,.5.5h.75a.5.5,0,0,0,.5-.5V9A2,2,0,0,0,13,7Z',
        color: 'fill-success-500'
    },
    {
        value: '$4,550',
        description: 'Avg Deal Size',
        iconPath: 'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM15.82,8.49a.5.5,0,0,0-.7,0l-4.74,4.74-1.5-1.49a.48.48,0,0,0-.7,0l-.53.53a.5.5,0,0,0,0,.71L10,15.35a.48.48,0,0,0,.7,0l5.62-5.62a.5.5,0,0,0,0-.71Z',
        color: 'fill-red-100'
    },
    {
        value: '$4,550',
        description: 'Referral Signup',
        iconPath: 'M17,12.19v-.38a.77.77,0,0,0-.22-.53L11.64,6.15a.5.5,0,0,0-.71,0l-.71.71a.49.49,0,0,0,0,.7L13.67,11H3.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H13.67l-3.45,3.44a.5.5,0,0,0,0,.71l.71.7a.5.5,0,0,0,.71,0l5.14-5.13A.75.75,0,0,0,17,12.19ZM14.67,12ZM19,3H13.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H19V19H13.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H19a2,2,0,0,0,2-2V5A2,2,0,0,0,19,3Z',
        color: 'fill-primary-500'
    }
];
export const accountTabrows = [
    {
        id: '678935899',
        name: 'Marcus Harris',
        date: 'Nov 12, 2021',
        percentage: '15%',
        amount: '$1,200.00'
    },
    {
        id: '678935900',
        name: 'Robert Smith',
        date: 'Nov 14, 2021',
        percentage: '53%',
        amount: '$2,400.00'
    },
    {
        id: '678935901',
        name: 'Williams Brown',
        date: 'Nov 15, 2021',
        percentage: '76%',
        amount: '$1,200.00'
    },
    {
        id: '678935902',
        name: 'Robert Smith',
        date: 'Nov 14, 2021',
        percentage: '53%',
        amount: '$1,200.00'
    }
];
export const AccountTab9rows = [
    {
        imgSrc: 'assets/images/profile-page/paypal.svg',
        description: 'Paypal **** 1679',
        name: 'Marcus Morris',
        date: '09/24/2022',
        actions: [
            {
                svgPath: 'M16.81,10a.5.5,0,0,1,0,.7L8.75,18.79a2,2,0,0,1-.68.45L3.73,21a.5.5,0,0,1-.54-.11l0,0A.5.5,0,0,1,3,20.27l1.72-4.34a2,2,0,0,1,.45-.68l8.07-8.07a.5.5,0,0,1,.71,0ZM20.56,4.1l-.66-.66A1.5,1.5,0,0,0,18.84,3h-.76A1.5,1.5,0,0,0,17,3.44L15.19,5.27a.5.5,0,0,0,0,.7L18,8.82a.5.5,0,0,0,.71,0L20.56,7A1.5,1.5,0,0,0,21,5.92V5.16A1.5,1.5,0,0,0,20.56,4.1Z'
            },
            {
                svgPath: 'M20,4.5v1a.5.5,0,0,1-.5.5H4.5A.5.5,0,0,1,4,5.5v-1A.5.5,0,0,1,4.5,4H9V3a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V4h4.5A.5.5,0,0,1,20,4.5ZM5.87,20.14a2,2,0,0,0,2,1.86h8.28a2,2,0,0,0,2-1.86L19,8H5Z'
            }
        ]
    },
    {
        imgSrc: 'assets/images/profile-page/paypal.svg',
        description: 'Paypal **** 1679',
        name: 'Marcus Morris',
        date: '09/24/2022',
        actions: [
            {
                svgPath: 'M16.81,10a.5.5,0,0,1,0,.7L8.75,18.79a2,2,0,0,1-.68.45L3.73,21a.5.5,0,0,1-.54-.11l0,0A.5.5,0,0,1,3,20.27l1.72-4.34a2,2,0,0,1,.45-.68l8.07-8.07a.5.5,0,0,1,.71,0ZM20.56,4.1l-.66-.66A1.5,1.5,0,0,0,18.84,3h-.76A1.5,1.5,0,0,0,17,3.44L15.19,5.27a.5.5,0,0,0,0,.7L18,8.82a.5.5,0,0,0,.71,0L20.56,7A1.5,1.5,0,0,0,21,5.92V5.16A1.5,1.5,0,0,0,20.56,4.1Z'
            },
            {
                svgPath: 'M20,4.5v1a.5.5,0,0,1-.5.5H4.5A.5.5,0,0,1,4,5.5v-1A.5.5,0,0,1,4.5,4H9V3a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V4h4.5A.5.5,0,0,1,20,4.5ZM5.87,20.14a2,2,0,0,0,2,1.86h8.28a2,2,0,0,0,2-1.86L19,8H5Z'
            }
        ]
    },
    {
        imgSrc: 'assets/images/profile-page/paypal.svg',
        description: 'Paypal **** 1679',
        name: 'Marcus Morris',
        date: '09/24/2022',
        actions: [
            {
                svgPath: 'M16.81,10a.5.5,0,0,1,0,.7L8.75,18.79a2,2,0,0,1-.68.45L3.73,21a.5.5,0,0,1-.54-.11l0,0A.5.5,0,0,1,3,20.27l1.72-4.34a2,2,0,0,1,.45-.68l8.07-8.07a.5.5,0,0,1,.71,0ZM20.56,4.1l-.66-.66A1.5,1.5,0,0,0,18.84,3h-.76A1.5,1.5,0,0,0,17,3.44L15.19,5.27a.5.5,0,0,0,0,.7L18,8.82a.5.5,0,0,0,.71,0L20.56,7A1.5,1.5,0,0,0,21,5.92V5.16A1.5,1.5,0,0,0,20.56,4.1Z'
            },
            {
                svgPath: 'M20,4.5v1a.5.5,0,0,1-.5.5H4.5A.5.5,0,0,1,4,5.5v-1A.5.5,0,0,1,4.5,4H9V3a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V4h4.5A.5.5,0,0,1,20,4.5ZM5.87,20.14a2,2,0,0,0,2,1.86h8.28a2,2,0,0,0,2-1.86L19,8H5Z'
            }
        ]
    }
];
export const invoices = [
    { name: 'Invoice for Octavia', amount: '$890', type: 'PDF', date: 'Nov 12, 2021' },
    { name: 'Invoice for Uko', amount: '$420', type: 'DOC', date: 'Nov 10, 2021' },
    { name: 'Invoice for Stocky', amount: '$590', type: 'PDF', date: 'Nov 24, 2021' },
    { name: 'Invoice for Aatrox', amount: '$750', type: 'DOC', date: 'Nov 19, 2021' },
    { name: 'Invoice for Octavia', amount: '$890', type: 'PDF', date: 'Nov 12, 2021' }
];

//users page data
export const userTabs = [
    {
        id: 'tab1',
        href: '/user-list',
        iconPath: 'M21,5.5v1a.5.5,0,0,1-.5.5H9.5A.5.5,0,0,1,9,6.5v-1A.5.5,0,0,1,9.5,5h11A.5.5,0,0,1,21,5.5ZM20.5,11H9.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,20.5,11Zm0,6H9.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,20.5,17ZM5,4A2,2,0,1,0,7,6,2,2,0,0,0,5,4Zm0,6a2,2,0,1,0,2,2A2,2,0,0,0,5,10Zm0,6a2,2,0,1,0,2,2A2,2,0,0,0,5,16Z'
    },
    {
        id: 'tab2',
        href: '/user-grid',
        iconPath: 'M8,4.5v3a.5.5,0,0,1-.5.5h-3A.5.5,0,0,1,4,7.5v-3A.5.5,0,0,1,4.5,4h3A.5.5,0,0,1,8,4.5ZM13.5,4h-3a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5v-3A.5.5,0,0,0,13.5,4Zm6,0h-3a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5v-3A.5.5,0,0,0,19.5,4Zm-12,6h-3a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5v-3A.5.5,0,0,0,7.5,10Zm6,0h-3a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5v-3A.5.5,0,0,0,13.5,10Zm6,0h-3a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5v-3A.5.5,0,0,0,19.5,10Zm-12,6h-3a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5v-3A.5.5,0,0,0,7.5,16Zm6,0h-3a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5v-3A.5.5,0,0,0,13.5,16Zm6,0h-3a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5v-3A.5.5,0,0,0,19.5,16Z'
    }
];

//apps email page data
export const emailUsers = [
    {
        name: 'Aiony Haust',
        image: 'assets/images/user/user-19.png',
        message: 'Tell me about something?',
        time: '1 year ago',
        statusIcon: 'ri-check-double-line',
        statusColor: 'text-gray-400',
        badge: ''
    },
    {
        name: 'Yev Ledenov',
        image: 'assets/images/user/user-11.png',
        message: 'Can you send some demo?',
        time: '1 year ago',
        statusIcon: 'ri-check-double-line',
        statusColor: 'text-primary-500',
        badge: ''
    },
    {
        name: 'Vicky Hladynets',
        image: 'assets/images/user/user-6.png',
        message: 'Can you send some demo?',
        time: '1 year ago',
        statusIcon: '',
        statusColor: '',
        badge: '5'
    },
    {
        name: 'Julian Wan',
        image: 'assets/images/user/user-11.png',
        message: 'Can you send some demo?',
        time: 'Thank You',
        statusIcon: 'ri-check-double-line',
        statusColor: 'text-gray-400',
        badge: ''
    },
    {
        name: 'Aiony Haust',
        image: 'assets/images/user/user-18.png',
        message: 'Tell me about something?',
        time: '1 year ago',
        statusIcon: 'ri-check-double-line',
        statusColor: 'text-gray-400',
        badge: ''
    },
    {
        name: 'Yev Ledenov',
        image: 'assets/images/user/user-11.png',
        message: 'Can you send some demo?',
        time: '1 year ago',
        statusIcon: 'ri-check-double-line',
        statusColor: 'text-primary-500',
        badge: ''
    },
    {
        name: 'Vicky Hladynets',
        image: 'assets/images/user/user-6.png',
        message: 'Can you send some demo?',
        time: '1 year ago',
        statusIcon: '',
        statusColor: '',
        badge: '5'
    },
    {
        name: 'Julian Wan',
        image: 'assets/images/user/user-11.png',
        message: 'Can you send some demo?',
        time: 'Thank You',
        statusIcon: 'ri-check-double-line',
        statusColor: 'text-gray-400',
        badge: ''
    }
];
export const messages = [
    { type: 'sent', text: 'Sure! Ready to help.', time: '11:29 AM', userImage: 'assets/images/user/user-11.png' },
    { type: 'received', text: 'Apple Business Chat, or Business Chat, allows customers to interact with a business.', time: '11:29 AM', userImage: 'assets/images/user/user-19.png', userName: 'Aiony Haust' },
    { type: 'sent', text: 'Sure! Ready to help.', time: '11:29 AM', userImage: 'assets/images/user/user-11.png' },
    { type: 'received', text: 'Apple Business Chat, or Business Chat, allows customers to interact with a business.', time: '11:29 AM', userImage: 'assets/images/user/user-19.png', userName: 'Aiony Haust' },
    { type: 'sent', text: 'Sure! Ready to help.', time: '11:29 AM', userImage: 'assets/images/user/user-11.png' },
    { type: 'received', text: 'Apple Business Chat, or Business Chat, allows customers to interact with a business.', time: '11:29 AM', userImage: 'assets/images/user/user-19.png', userName: 'Aiony Haust' },
    { type: 'sent', text: 'Sure! Ready to help.', time: '11:29 AM', userImage: 'assets/images/user/user-11.png' }
];

//session pages data
export const channels = [
    {
        imgSrc: 'assets/images/social-media/twitter-round.svg',
        alt: 'Twitter',
        title: 'Latest News',
        description: 'Follow us at',
        linkText: 'UI-Lib',
        linkHref: '#!'
    },
    {
        imgSrc: 'assets/images/social-media/github.svg',
        alt: 'GitHub',
        title: 'GitHub Access',
        description: 'Follow us at',
        linkText: 'UI-Lib',
        linkHref: '#!'
    },
    {
        imgSrc: 'assets/images/social-media/linkedin.svg',
        alt: 'LinkedIn',
        title: 'Social Media',
        description: 'Follow us at',
        linkText: 'UI-Lib',
        linkHref: '#!'
    },
    {
        imgSrc: 'assets/images/social-media/instagram-round.svg',
        alt: 'Instagram',
        title: 'Social Media',
        description: 'Follow us at',
        linkText: 'UI-Lib',
        linkHref: '#!'
    }
];
export const listItems = ['Quick Start', 'Folder Structure', 'Color', 'Components', 'Routing', 'Navigations', 'Environment Variables', 'Mock Axios Adapter', 'Setting'];

//file manager data 
export const folders = [
    {
        name: 'Designs',
        files: '125 Files',
        size: '13.2 GB',
        date: '16 DEC, 2022',
        icon: 'ri-folder-fill',
        checked: false
    },
    {
        name: 'Photos',
        files: '1024 Images',
        size: '10 GB',
        date: '14 DEC, 2022',
        icon: 'ri-folder-fill',
        checked: false
    },
    {
        name: 'Movies',
        files: '45 Files',
        size: '120 GB',
        date: '12 DEC, 2022',
        icon: 'ri-folder-fill',
        checked: false
    },
    {
        name: 'MP3 Music',
        files: '125 Files',
        size: '3.2 GB',
        date: '05 DEC, 2022',
        icon: 'ri-folder-fill',
        checked: false
    },
    {
        name: 'Videos',
        files: '10 Files',
        size: '13.2 GB',
        date: '01 DEC, 2022',
        icon: 'ri-folder-fill',
        checked: false
    },
    {
        name: 'Documents',
        files: '512 Files',
        size: '8.3 GB',
        date: '28 NOV, 2022',
        icon: 'ri-folder-fill',
        checked: false
    },
    {
        name: 'Archives',
        files: '75 Files',
        size: '22.5 GB',
        date: '22 NOV, 2022',
        icon: 'ri-folder-fill',
        checked: false
    },
    {
        name: 'Applications',
        files: '30 Files',
        size: '18.7 GB',
        date: '18 NOV, 2022',
        icon: 'ri-folder-fill',
        checked: false
    },
    {
        name: 'Music Projects',
        files: '230 Files',
        size: '14.5 GB',
        date: '15 NOV, 2022',
        icon: 'ri-folder-fill',
        checked: false
    },
    {
        name: 'Work',
        files: '90 Files',
        size: '5.7 GB',
        date: '10 NOV, 2022',
        icon: 'ri-folder-fill',
        checked: false
    },
    {
        name: 'Game Data',
        files: '305 Files',
        size: '60 GB',
        date: '05 NOV, 2022',
        icon: 'ri-folder-fill',
        checked: false
    },
    {
        name: 'E-books',
        files: '1000 Files',
        size: '12 GB',
        date: '01 NOV, 2022',
        icon: 'ri-folder-fill',
        checked: false
    },
    {
        name: 'Personal',
        files: '150 Files',
        size: '8 GB',
        date: '30 OCT, 2022',
        icon: 'ri-folder-fill',
        checked: false
    }
];