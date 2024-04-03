require('dotenv').config();
const {Bot, GrammyError, HttpError, Keyboard, InlineKeyboard} = require('grammy');
const {hydrate} = require('@grammyjs/hydrate');

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());


bot.command('start', async (ctx) =>
{
    await ctx.reply('Хай, зайди в меню...')
});




//робимо массив команд
bot.api.setMyCommands(
    [
        {
            command: 'want_mk',
            description: 'Можно записатись на МК',
        },
        {
            command:'first_lesson',
            description: 'Якщо вперше, спробуй себе на халявному уроку',
        },
        {
            command:'how_i_am',
            description: 'Я зара розкажу шо ти за фрукт',
        },
        {
            command:'parse',
            description: 'Тута силка на канал',
        },
        {
            command:'parse2',
            description: 'Тута силка на канал без превью',
        },
        {
            command:'hydrate',
            description: 'Тута силка на канал без превью',
        },

    
    ]
)


// команда
bot.command('want_mk', async (ctx) =>
{
    await ctx.reply('Бабки вперед!')
});

// команда
bot.command('first_lesson', async (ctx) =>
{
    await ctx.reply('ну спробуй шо...')
});

// команда розкаже шо ти за фрукт і реакція
bot.command('how_i_am', async (ctx) =>
{
    // await ctx.reply(`Твій ID: ${ctx.from.id}`);
    // await ctx.reply(`Твій телефон: ${ctx.from.phone_number}`);
    await ctx.react("👍")
    await ctx.reply(`Твій ID: ${ctx.from.id}` ,
    {
        reply_parameters: {message_id: ctx.msg.message_id}
    });

});

// команда link parse and spoiler
bot.command('parse', async (ctx) =>
{
    await ctx.reply('Тут силка на канал який колись буде <a href="https://t.me/dmytrogordon_official"> <span class="tg-spoiler">links </span></a>',
    {
        parse_mode: 'HTML'
    });
});

//силка без превью
bot.command('parse2', async (ctx) =>
{
    await ctx.reply('Тут \\! силка \\ [canal](https://t.me/kpszsu)',
    {
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true
    });
});


//команда клавіатури
bot.command('mood', async (ctx) =>
{
    const moodKeyboard = new Keyboard().text('Good').row().text('So').text('Fuck').row().resized()
    await ctx.reply('How are you?',
    {
        reply_markup: moodKeyboard
    })
});


//команда запрос
bot.command('share', async (ctx) =>
{
    const shareKeyboard = new Keyboard().requestLocation('Location').requestContact('Contact').requestPoll('Poll').placeholder('ну попробуй').resized()
    await ctx.reply('Шо показати?',
    {
        reply_markup: shareKeyboard
    })
});

//принять контакт
bot.on(':contact', async (ctx) =>
{
    await ctx.reply('Чоткий номер')
});


const hydrateKeyboard = new InlineKeyboard()
    .text('Взнати статус заказа', 'order-status')
    .text('Написати в підтримку', 'support');

const backKeyboard = new InlineKeyboard()
    .text('Назад в меню', 'back');

//INLINE клава інтерактивная з hydrate
bot.command('hydrate', async (ctx) =>
{
    await ctx.reply('Обери пункт меню' ,
    {
        reply_markup: hydrateKeyboard,
    });
});

bot.callbackQuery('order-status', async (ctx) =>
{
    await ctx.callbackQuery.message.editText('Статус заказа в пути',
    {
        reply_markup: backKeyboard,
    })
    await ctx.callbackQuery()
});

bot.callbackQuery('support', async (ctx) =>
{
    await ctx.callbackQuery.message.editText('Черкани запрос',
    {
        reply_markup: backKeyboard,
    })
    await ctx.callbackQuery()
});

bot.callbackQuery('back', async (ctx) =>
{
    await ctx.callbackQuery.message.editText('бери пункт меню',
    {
        reply_markup: hydrateKeyboard,
    })
    await ctx.callbackQuery()
});



//відповідь на клавіатуру і закриває її
bot.hears('Good', async ctx => 
{
    await ctx.reply('OK',
    {
        reply_markup: {remove_keyboard: true}
    });

});



//сказати яке ID, також бот відповість на твое смс
bot.hears('ID', async ctx => 
{
    await ctx.reply(`Твій ID: ${ctx.from.id}` ,
    {
        reply_parameters: {message_id: ctx.msg.message_id}
    });

});





//голосове
bot.on(':voice', async (ctx) =>
{
    await ctx.reply('Я цього не чув')
});


//силка
bot.on('::url', async (ctx) =>
{
    await ctx.reply('шо за сомнітельна силка?')
});


//свій фільтр дізнатись хто адмін
bot.on('msg').filter((ctx) => 
    {
        return ctx.from.id === 339085573 // якщо тру
    }, async (ctx) =>
    {
        await ctx.reply('о хазаін драсте') //працюєм
    });


//ще фільтр більш тонкіше, також і массив якщо треба
bot.hears('пінг', async ctx => 
{
    await ctx.reply('ну понг і шо')
});


//реакція на погані слова
bot.hears(/пипец/, async ctx => 
{
    await ctx.reply('ти шо ругаешься, курица')
});





//загальна відповідь
bot.on('msg', async (ctx) =>
{
    await ctx.reply('І шо ти чудиш?')
    console.log(ctx.msg);
    console.log(ctx.from); //інфа користувача
    console.log(ctx.me);
});






// // массив команд і одна відповідь
// bot.command(['want_mk', 'first_lesson', 'say_hi'], async (ctx) =>
// {
//     await ctx.reply('І шо ти чудиш? Hello')
// });




bot.catch(err =>
    {
        const ctx = err.ctx;
        console.error('Error while handlind update ${ctx.update.update_id}:');
        const e = err.error;

        if (e instanceof GrammyError) {
            console.error(e.message);
        } else if (e instanceof HttpError) {
            console.error(e.message);
        } else {
            console.error(e);
        }
    })




bot.start();