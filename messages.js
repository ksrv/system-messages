import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export default Messages = new Mongo.Collection('peredaj_messages');

Messages.deny({
    insert(){ return true },
    update(){ return true },
    remove(){ return true },
});

let schema = new SimpleSchema({
    name: {
        type: String,
        min: 2
    },

    type: {
        type: String,
        allowedValues: [
            'error',
            'danger',
            'success',
            'warning',
            'info'
        ]
    },

    title: {
        type: String,
    },

    text: {
        type: String,
    }
});

Messages.attachSchema(schema);

if(Meteor.isServer){
    Meteor.publish('ksrv_messages', function(){
        return Messages.find();
    });
}

if(Meteor.isClient){
    /**
     * Коллекция для локального хранения на клиенте
     * системных сообщений
     */
    export default SysMessages = new Mongo.Collection(null);


    Meteor.startup(function(){
        Meteor.subscribe('ksrv_messages');
    });

    /**
     * Функция показа системного сообщения.
     * При наличии документа-шаблона в коллекции Messages
     *     формирует системное сообщение и сохраняет его
     *     в коллекции SystemMessages
     * 
     * 
     * @param {[type]} name    Название действия
     * @param {[type]} type    Тип сообщения
     * @param {[type]} options Опции
     */
    export default Message = function(name, type, options){
        let types = ['info', 'success', 'error', 'warning', 'danger'];

        if(!(name && typeof name === 'string')){
            console.warn('Argument "name" is required and must be string');
        }

        if(!(type && typeof type === 'string')){
            console.warn('Argument "type" is required and must be string');
        }

        if(types.indexOf(type) < 0){
            console.warn('Argument "type" must be one of [' + types.join(', ') + ']');
        }

        let query = {};
        query.name = name;
        if(['error', 'danger'].indexOf(type) >= 0){
            query.type = { $in: ['error', 'danger'] };
        }else{
            query.type = type;
        }

        let message = Messages.findOne(query);

        // если нет шаблона сообщения - выход
        if(!message){
            return;  
        }

        // если это сообщение об ошибке и передана системная ошибка
        // то сохраним ее
        if(type == 'error' && options.error){
            message.error = options.error;
        }

        // обработка шаблона сообщения
        if(message.title && options && options.item && options.item.title){
            message.title = message.title.replace(/\[title\]/g, '"${options.item.title}"');
        }

        if(message.text && options && options.item && options.item.title){
            message.text = message.text.replace(/\[title\]/g, '"${options.item.title}"');
        }

        if(Meteor.userId()){
            message.userId = Meteor.userId();
        }

        SysMessages.insert(message);
    }

}
