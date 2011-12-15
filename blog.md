---
layout: page
---
<div class="category">
    <ul>
    {% for post in site.posts%}
        <li>
            <h2>
            	<a href="{{ post.url }}">{{ post.title }}</a>
                <span>{{ post.description }}</span>
            </h2>
        </li>
    {% endfor %}
    </ul>
</div><!-- .entry -->
