let handler = async (m, { conn, args: [event], text }) => {
    let mentions = text.replace(event, '').trimStart()
    let who = mentions ? conn.parseMention(mentions) : []
    let participants = who.length ? who : [m.sender]
    let action = false
    m.reply(`Simulando ${event}...`)
    switch (event.toLowerCase()) {
        case 'add':
        case 'invite':
        case 'welcome':
            action = 'add'
            break
        case 'bye':
        case 'kick':
        case 'leave':
        case 'remove':
            action = 'remove'
            break
        case 'promote':
            action = 'promote'
            break
        case 'demote':
            action = 'demote'
            break
        case 'delete':
            deleted = m
            break
        default: throw `Eventos: welcome, bye, delete, promote, demote`
    }
    if (action) return conn.onParticipantsUpdate({
        jid: m.chat,
        participants,
        action
    })
    return conn.onDelete(m)
}
handler.help = ['simular (evento) (@user)']
handler.tags = ['owner', 'group']

handler.command = /^simular$/i
module.exports = handler

