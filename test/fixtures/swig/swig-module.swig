{# [dash:data]
    {
        "status": "development",
        "category": "module",
        "label": "swig-module",
        "link": "../dashboard/generated/swig-module.html"
    }
    [/dash] #}
{# [dash:swig]
    {{ swigModule.content() }}
    [/dash] #}

{% macro content() %}
    <div class="swig-module">
        <p>This is an example paragraph</p>
    </div>
{% endmacro %}
