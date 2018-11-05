'use strict';

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-template */
// Public node modules.
const _ = require('lodash');
var ses = require('node-ses')
var client;
/* eslint-disable no-unused-vars */
module.exports = {
  provider: 'awsses',
  name: 'AWS SES',
  auth: {
    awsses_default_from: {
      label: 'Amazon Web Services SES default from',
      type: 'text'
    },
    awsses_default_replyto: {
      label: 'AWS Default Reply-To',
      type: 'text'
    },
    awsses_access_key_id: {
      label: 'AWS SES Access Key',
      type: 'text'
    },
    awsses_secret_access_key_id: {
      label: 'AWS SES Secret Access Key',
      type: 'text'
    },
    awsses_endpoint: {
      label: 'AWS SES https endpoint',
      type: 'text'
    }
  },
  init: (config) => {

    client = ses.createClient({
      key: config.awsses_access_key_id,
      secret: config.awsses_secret_access_key_id,
      amazon: config.awsses_endpoint
    })
    
    return {
      send: (options, cb) => {
        return new Promise((resolve, reject) => {
          // Default values.
          options = _.isObject(options) ? options : {};
          options.from = config.awsses_default_from || options.from;
          options.replyTo =  config.awsses_default_replyto || options.replyTo;
          options.text = options.text || options.html;
          options.html = options.html || options.text;


          client.sendEmail({
            from: options.from,
            to: options.to,
            reply_to: options.replyTo,
            subject: options.subject,
            message:options.text || options.html,
            text: options.text,
            html: options.html
          }, function (err, data, res) {
            if (err) {
              console.log(err);
              console.log(data);
              console.log(res);
              reject([{ messages: [{ id: 'Auth.form.error.email.invalid' }] }]);
            } else {
              console.log(data);
              console.log(res);
              resolve();
            }
          });

        });
      }
    };
  }
};
