---
layout: structure--page
title: Welcome
---
Hark Heritage - Emma Golby-Kirk consultancy.

{% assign root_url = '/' %}
{% assign pages = site.pages | sort:"title" %}
{% for page in pages %}
{% assign url_array = page.url | split:root_url %}
{% if url_array[0] == '' and url_array[1] != '404.html' %}
* [{{ page.title }}]({{ page.url }}) [{{ url_array }}]
{% endif %}
{% endfor %}