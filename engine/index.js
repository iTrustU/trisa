const apiaiParameter = require('./apiai')
require('dotenv').config();
const axios = require('axios')
const algoliasearch = require('algoliasearch')
const client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_TOKEN)
const index = client.initIndex(process.env.ALGOLIA_INDEX)

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
const defaultEmpty = [{
        type: 'text',
        data: 'maaf kami tidak bisa menemukan agent yang sesuai'
    },
    {
        type: 'text',
        data: 'untuk saat ini kami belum bisa menemukan agent sesuai permintaan kamu'
    }
]
const defaultFindAgent = [{
        type: 'text',
        data: 'berikut adalah data agent agent yang sesuai dengan pencarian kamu'
    }
]

const randomizeChat = (array = []) => {
    return array[Math.floor(Math.random(array.length - 1))]
}

const getParam = (parameters) => {
  let output = []
  Object.keys(parameters).forEach(parameter => {
    if (parameters[parameter]!=='') {
      output.push(parameters[parameter])
    }
  })
  return output.join(' ')
}

const findAlgolia = (parameters) => {
  return new Promise((res,rej) => {
    return index.search(getParam(parameters), function(err, content) {
      if (err) {
        rej(err)
      }
      const output = content.hits.map(hit => {
        return {
          id:hit.id,
          picture:hit['profile.profilePicture'],
          name:hit['profile.name'],
          city:hit['profile.city'],
          company:hit['insuranceCompany.name']
        }
      })
      res(output)
    })
  })
}

const getReply = function(userId, message) {
    return new Promise((res, rej) => {
        return apiaiParameter(userId, message).then(apiParam => {
            switch (apiParam.action) {
                case 'find_info':
                    res([info[apiParam.parameters.info_name].reply, randomizeChat(defaultInfo)])
                    break;
                case 'find_agent':
                return findAlgolia(apiParam.parameters).then(data => {
                  if (data.length > 0) {
                    const chatAgent = {
                      type:'agent',
                      data:data
                    }
                    res([randomizeChat(defaultFindAgent), chatAgent])
                  }else {
                    res([randomizeChat(defaultEmpty)])
                  }

                })
                    break;
                default:
                    const output = {
                        type: 'text',
                        data: apiParam.fulfillment.speech
                    }
                    res([output])
                    break;
            }
        })
    })
}


module.exports = getReply
