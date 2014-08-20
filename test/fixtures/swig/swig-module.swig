{# [dash:data]
    {
        "status": "development",
        "category": "module",
        "label": "swig-module",
        "link": "../dashboard/generated/swig-module.html"
    }
    [/dash] #}
{# [dash:swig]
    {% import 'test/fixtures/swig/swig-module.swig' as swigModule %}
    {{ swigModule.content() }}
    [/dash] #}

{% macro content() %}
    <div class="swig-module">
        <p>This is an example paragraph</p>
    </div>
{% endmacro %}
