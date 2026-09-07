<?php
/**
 * Page 404.
 *
 * WordPress ne stocke pas la page d'erreur en base : son contenu est
 * déposé par l'export dans parts/contenu-404.html et inclus ici. Le
 * pied de page réduit propre à cette page vient de footer-404.php.
 */

get_header();

$copro_contenu = get_template_directory() . '/parts/contenu-404.html';
if ( file_exists( $copro_contenu ) ) {
	$copro_html = file_get_contents( $copro_contenu );
	// Les liens sont écrits avec un jeton, résolu ici vers les vraies URL.
	echo str_replace( '%ACCUEIL%', esc_url( home_url( '/' ) ), $copro_html ); // phpcs:ignore WordPress.Security.EscapeOutput
}

get_footer( '404' );
