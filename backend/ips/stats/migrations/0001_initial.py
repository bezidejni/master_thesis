# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'CPUInfo'
        db.create_table(u'stats_cpuinfo', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('value', self.gf('django.db.models.fields.DecimalField')(max_digits=6, decimal_places=3)),
            ('timestamp', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime.now)),
        ))
        db.send_create_signal(u'stats', ['CPUInfo'])

        # Adding model 'NetworkInfo'
        db.create_table(u'stats_networkinfo', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('source_url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('destination_url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('http_status', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'stats', ['NetworkInfo'])


    def backwards(self, orm):
        # Deleting model 'CPUInfo'
        db.delete_table(u'stats_cpuinfo')

        # Deleting model 'NetworkInfo'
        db.delete_table(u'stats_networkinfo')


    models = {
        u'stats.cpuinfo': {
            'Meta': {'object_name': 'CPUInfo'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'timestamp': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'value': ('django.db.models.fields.DecimalField', [], {'max_digits': '6', 'decimal_places': '3'})
        },
        u'stats.networkinfo': {
            'Meta': {'object_name': 'NetworkInfo'},
            'destination_url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'http_status': ('django.db.models.fields.IntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'source_url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'})
        }
    }

    complete_apps = ['stats']