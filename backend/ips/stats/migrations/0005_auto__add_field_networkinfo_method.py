# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'NetworkInfo.method'
        db.add_column(u'stats_networkinfo', 'method',
                      self.gf('django.db.models.fields.CharField')(default='GET', max_length=10),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'NetworkInfo.method'
        db.delete_column(u'stats_networkinfo', 'method')


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
            'http_status': ('django.db.models.fields.CharField', [], {'max_length': '3', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'method': ('django.db.models.fields.CharField', [], {'default': "'GET'", 'max_length': '10'}),
            'source_url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'timestamp': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'type': ('django.db.models.fields.CharField', [], {'default': "'main_frame'", 'max_length': '15'})
        }
    }

    complete_apps = ['stats']