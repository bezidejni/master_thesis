# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'NetworkInfo.source_url'
        db.alter_column(u'stats_networkinfo', 'source_url', self.gf('django.db.models.fields.URLField')(max_length=1000))

        # Changing field 'NetworkInfo.destination_url'
        db.alter_column(u'stats_networkinfo', 'destination_url', self.gf('django.db.models.fields.URLField')(max_length=1000))

    def backwards(self, orm):

        # Changing field 'NetworkInfo.source_url'
        db.alter_column(u'stats_networkinfo', 'source_url', self.gf('django.db.models.fields.URLField')(max_length=200))

        # Changing field 'NetworkInfo.destination_url'
        db.alter_column(u'stats_networkinfo', 'destination_url', self.gf('django.db.models.fields.URLField')(max_length=200))

    models = {
        u'stats.cpuinfo': {
            'Meta': {'object_name': 'CPUInfo'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'timestamp': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'value': ('django.db.models.fields.DecimalField', [], {'max_digits': '6', 'decimal_places': '3'})
        },
        u'stats.domelementcount': {
            'Meta': {'object_name': 'DOMElementCount'},
            'count': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'element_name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'timestamp': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'})
        },
        u'stats.networkinfo': {
            'Meta': {'object_name': 'NetworkInfo'},
            'destination_url': ('django.db.models.fields.URLField', [], {'max_length': '1000', 'blank': 'True'}),
            'http_status': ('django.db.models.fields.CharField', [], {'max_length': '3', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'method': ('django.db.models.fields.CharField', [], {'default': "'GET'", 'max_length': '10'}),
            'source_url': ('django.db.models.fields.URLField', [], {'max_length': '1000', 'blank': 'True'}),
            'timestamp': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'type': ('django.db.models.fields.CharField', [], {'default': "'main_frame'", 'max_length': '15'})
        }
    }

    complete_apps = ['stats']