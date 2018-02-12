const apiaiParameter = require('./apiai')

const info = {
    asuransi: {
        reply: {
            type: 'text',
            data: 'Asuransi adalah suatu perjanjian dengan mana seorang penanggung mengikatkan diri kepada seseorang tertanggung dengan menerima suatu premi, untuk memberikan penggantian kepadanya karena suatu kerugian, kerusakan atau kehilangan keuntungan yang diharapkan yang mungkin akan dideritanya karena suatu peristiwa yang tak tertentu'
        }
    },
    polis: {
        reply: {
            type: 'text',
            data: 'Polis asuransi merupakan sebuah bukti perjanjian tertulis yang dilakukan oleh pihak perusahaan asuransi (penanggung) dengan nasabah pengguna layanan asuransi (tertanggung), yang isinya menjelaskan segala hak dan kewajiban antara kedua belah pihak tersebut'
        }
    },
    cara_claim: {
        reply: {
            type: 'text',
            data: 'hmm pertanyaan menarik mungkin article ini bisa membantu kamu https://www.finansialku.com/cara-klaim-asuransi-jiwa/'
        }
    }
}

const defaultInfo = [{
        type: 'text',
        data: 'gimana infonya apakah membantu? ada lagi yang mau di tanya?'
    },
    {
        type: 'text',
        data: 'semoga jawabannya memuaskan yah, sering- sering bertanya biar saya semangkin pintar'
    }
]

const randomizeChat = (array = []) => {
    return array[Math.floor(Math.random(array.length - 1))]
}

const getReply = function(userId, message) {
    return new Promise((res, rej) => {
        apiaiParameter(userId, message).then(apiParam => {
            switch (apiParam.action) {
                case 'find_info':
                    res([info[apiParam.parameters.info_name].reply, randomizeChat(defaultInfo)])
                default:
                    break;
            }
        })
    })
}


module.exports = getReply