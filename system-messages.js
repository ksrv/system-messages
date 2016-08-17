import {Meteor}         from 'meteor/meteor';
import {Mongo}          from 'meteor/mongo';
import {SimpleSchema}   from 'meteor/aldeed:simple-schema';

export const SMTemplates = new Mongo.Collection('ksrv_system_message_templates');

SMTemplates.deny({
    insert(){ return true },
    update(){ return true },
    remove(){ return true },
});

let Schema = new SimpleSchema({
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
        optional: true
    },

    text: {
        type: String,
    }
});

SMTemplates.attachSchema(Schema);

if(Meteor.isClient){
    /**
     * System messages.
     * Client local collection.
     */
    export const SysMessages = new Mongo.Collection(null);

    Meteor.startup(function(){
        Meteor.subscribe('ksrv_system_message_templates');
    });

    export const SysMessage = function(name, type, options){
        let types = ['info', 'success', 'error', 'warning', 'danger'];
        let query = {};
        let message;

        if(!(name && typeof name === 'string')){
            console.warn('Argument "name" is required and must be string');
        }

        if(!(type && typeof type === 'string')){
            console.warn('Argument "type" is required and must be string');
        }

        if(types.indexOf(type) < 0){
            console.warn('Argument "type" must be one of [' + types.join(', ') + ']');
        }

        query.name = name;

        if(['error', 'danger'].indexOf(type) >= 0){
            query.type = { $in: ['error', 'danger'] };
        }else{
            query.type = type;
        }

        message = SMTemplates.findOne(query);

        if(!message){
            return;  
        }

        if(type == 'error' && options && options.error){
            message.error = options.error;
        }

        if(message.title && options && options.doc && options.doc.title){
            message.title = message.title.replace(/\[title\]/g, '"${options.doc.title}"');
        }

        if(message.text && options && options.doc && options.doc.title){
            message.text = message.text.replace(/\[title\]/g, '"${options.doc.title}"');
        }

        if(Meteor.userId()){
            message.userId = Meteor.userId();
        }

        delete message._id;

        SysMessages.insert(message);
    }

    
}

if(Meteor.isServer){
    Meteor.publish('ksrv_system_message_templates', function(){
        return SMTemplates.find();
    });
}