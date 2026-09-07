<?php
/**
 * Gabarit d'une page.
 *
 * Le corps de chaque page du site statique — tout ce que contenait
 * <main id="contenu"> — est stocké dans le contenu WordPress, découpé en
 * blocs « HTML personnalisé » section par section. Il est donc restitué
 * tel quel, et reste modifiable depuis l'éditeur.
 */

get_header();

while ( have_posts() ) {
	the_post();
	the_content();
}

get_footer();
