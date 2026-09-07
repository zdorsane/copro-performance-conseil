<?php
/**
 * Copro Performance Conseil — fonctions du thème.
 *
 * Le site d'origine est un site statique écrit à la main. Ce thème le
 * reproduit à l'identique : les feuilles de style et les scripts ne sont
 * pas retouchés, seul l'habillage (en-tête, pied de page) devient
 * dynamique, et le corps de chaque page devient éditable dans WordPress.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'COPRO_VERSION', '1.0.0' );

/* ------------------------------------------------------------------ */
/* Réglages du thème                                                   */
/* ------------------------------------------------------------------ */

function copro_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/style.css' );

	register_nav_menus( array(
		'principale' => 'Navigation principale',
		'legale'     => 'Liens légaux (pied de page)',
	) );
}
add_action( 'after_setup_theme', 'copro_setup' );

/* ------------------------------------------------------------------ */
/* Styles et scripts                                                   */
/* ------------------------------------------------------------------ */

function copro_assets() {
	$uri = get_template_directory_uri();

	// L'en-tête de thème exigé par WordPress. Ne contient aucune règle.
	wp_enqueue_style( 'copro-theme', get_stylesheet_uri(), array(), COPRO_VERSION );

	// Les deux feuilles réelles du site, dans leur ordre d'origine.
	wp_enqueue_style( 'copro-style', $uri . '/assets/css/style.css', array( 'copro-theme' ), COPRO_VERSION );
	wp_enqueue_style( 'copro-signature', $uri . '/assets/css/signature.css', array( 'copro-style' ), COPRO_VERSION );

	// Les deux scripts, chargés en defer comme sur le site d'origine.
	$args = array( 'strategy' => 'defer', 'in_footer' => false );
	wp_enqueue_script( 'copro-main', $uri . '/assets/js/main.js', array(), COPRO_VERSION, $args );
	wp_enqueue_script( 'copro-signature-js', $uri . '/assets/js/signature.js', array(), COPRO_VERSION, $args );
}
add_action( 'wp_enqueue_scripts', 'copro_assets' );

/* ------------------------------------------------------------------ */
/* Fidélité du HTML                                                    */
/* ------------------------------------------------------------------ */

/**
 * WordPress ajoute d'office des <p> et des <br> dans le contenu. Sur un
 * balisage écrit à la main comme celui-ci, cela casse la mise en page.
 * On désactive ces filtres : le HTML des pages est restitué tel quel.
 */
function copro_html_intact() {
	remove_filter( 'the_content', 'wpautop' );
	remove_filter( 'the_content', 'shortcode_unautop' );
	remove_filter( 'the_content', 'wptexturize' );
	remove_filter( 'the_excerpt', 'wpautop' );
}
add_action( 'init', 'copro_html_intact' );

/**
 * Les images du site portent déjà leurs dimensions et leur stratégie de
 * chargement dans le balisage d'origine.
 */
add_filter( 'wp_lazy_loading_enabled', '__return_false' );

/* ------------------------------------------------------------------ */
/* Métadonnées de page                                                 */
/* ------------------------------------------------------------------ */

/**
 * Lit une métadonnée de la page courante, avec valeur par défaut.
 *
 * @param string $cle    Clé sans le préfixe « _copro_ ».
 * @param mixed  $defaut Valeur si la métadonnée est absente.
 * @return mixed
 */
function copro_meta( $cle, $defaut = '' ) {
	$id = get_queried_object_id();
	if ( ! $id ) {
		return $defaut;
	}
	$valeur = get_post_meta( $id, '_copro_' . $cle, true );
	return ( '' === $valeur || null === $valeur ) ? $defaut : $valeur;
}

/**
 * Vrai si une extension SEO gère déjà les balises meta, auquel cas le
 * thème s'efface pour ne pas produire de doublons.
 */
function copro_seo_externe() {
	return defined( 'WPSEO_VERSION' )          // Yoast
		|| defined( 'RANK_MATH_VERSION' )      // Rank Math
		|| defined( 'SEOPRESS_VERSION' )       // SEOPress
		|| class_exists( 'All_in_One_SEO_Pack' );
}

/**
 * Restitue les balises meta, Open Graph, Twitter et les données
 * structurées que portait chaque page du site statique.
 */
function copro_tetes_seo() {
	if ( copro_seo_externe() ) {
		return;
	}

	$titre       = wp_get_document_title();
	$description = copro_meta( 'description' );
	$robots      = copro_meta( 'robots' );
	$image       = copro_meta( 'og_image' );
	$url         = is_front_page() ? home_url( '/' ) : get_permalink();

	if ( $description ) {
		printf( "<meta name=\"description\" content=\"%s\">\n", esc_attr( $description ) );
	}
	if ( $robots ) {
		printf( "<meta name=\"robots\" content=\"%s\">\n", esc_attr( $robots ) );
	}

	printf( "<meta name=\"author\" content=\"%s\">\n", esc_attr( get_bloginfo( 'name' ) ) );
	echo "<meta name=\"theme-color\" content=\"#0B1C2C\">\n";

	printf( "<meta property=\"og:type\" content=\"%s\">\n", is_front_page() ? 'website' : 'article' );
	echo "<meta property=\"og:locale\" content=\"fr_FR\">\n";
	printf( "<meta property=\"og:site_name\" content=\"%s\">\n", esc_attr( get_bloginfo( 'name' ) ) );
	printf( "<meta property=\"og:title\" content=\"%s\">\n", esc_attr( $titre ) );
	if ( $description ) {
		printf( "<meta property=\"og:description\" content=\"%s\">\n", esc_attr( $description ) );
	}
	printf( "<meta property=\"og:url\" content=\"%s\">\n", esc_url( $url ) );
	if ( $image ) {
		printf( "<meta property=\"og:image\" content=\"%s\">\n", esc_url( $image ) );
		echo "<meta property=\"og:image:width\" content=\"1200\">\n";
		echo "<meta property=\"og:image:height\" content=\"630\">\n";
	}

	echo "<meta name=\"twitter:card\" content=\"summary_large_image\">\n";
	printf( "<meta name=\"twitter:title\" content=\"%s\">\n", esc_attr( $titre ) );
	if ( $description ) {
		printf( "<meta name=\"twitter:description\" content=\"%s\">\n", esc_attr( $description ) );
	}
	if ( $image ) {
		printf( "<meta name=\"twitter:image\" content=\"%s\">\n", esc_url( $image ) );
	}

	// Données structurées de la page, reprises telles quelles.
	$jsonld = copro_meta( 'jsonld' );
	if ( $jsonld ) {
		echo $jsonld . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput -- JSON-LD figé à l'import.
	}
}
add_action( 'wp_head', 'copro_tetes_seo', 2 );

/**
 * Favicon, icône iOS et manifeste, comme sur le site d'origine.
 */
function copro_icones() {
	$uri = get_template_directory_uri();
	printf( "<link rel=\"icon\" href=\"%s/assets/img/favicon.svg\" type=\"image/svg+xml\">\n", esc_url( $uri ) );
	printf( "<link rel=\"apple-touch-icon\" href=\"%s/assets/img/apple-touch-icon.png\">\n", esc_url( $uri ) );
	printf( "<link rel=\"manifest\" href=\"%s/assets/site.webmanifest\">\n", esc_url( $uri ) );
}
add_action( 'wp_head', 'copro_icones', 3 );

/* ------------------------------------------------------------------ */
/* Mise en route                                                       */
/* ------------------------------------------------------------------ */

/**
 * Règle ce que le site attend pour s'afficher correctement : des
 * permaliens en /nom-de-la-page/ et la page « accueil » en page
 * d'accueil. Exécuté à l'activation du thème, puis de nouveau à la fin
 * de l'import du contenu — car à l'activation la page d'accueil
 * n'existe pas encore.
 */
function copro_configurer() {
	if ( '/%postname%/' !== get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
		flush_rewrite_rules();
	}

	$accueil = get_page_by_path( 'accueil' );
	if ( $accueil ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $accueil->ID );
	}
}
add_action( 'after_switch_theme', 'copro_configurer' );
add_action( 'import_end', 'copro_configurer' );

/**
 * Rappelle en console d'administration les deux réglages que l'import
 * ne peut pas deviner : le nom du site et son slogan, tous deux repris
 * dans l'en-tête et le pied de page.
 */
function copro_avis_identite() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$nom     = get_bloginfo( 'name' );
	$slogan  = get_bloginfo( 'description' );
	$attendu = 'Copro Performance Conseil';

	if ( $nom === $attendu && '' !== $slogan ) {
		return;
	}
	printf(
		'<div class="notice notice-warning"><p><strong>Thème Copro Performance Conseil :</strong> '
		. 'le nom du site et le slogan s’affichent dans l’en-tête et le pied de page. '
		. 'Renseignez-les dans <a href="%s">Réglages › Général</a> — nom : « %s », slogan : « Conseil indépendant en copropriété ».</p></div>',
		esc_url( admin_url( 'options-general.php' ) ),
		esc_html( $attendu )
	);
}
add_action( 'admin_notices', 'copro_avis_identite' );

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

/**
 * L'URL d'une page à partir de son slug, avec repli propre si la page
 * n'a pas encore été importée.
 *
 * @param string $slug Identifiant de la page.
 * @return string
 */
function copro_url( $slug ) {
	$page = get_page_by_path( $slug );
	return $page ? get_permalink( $page ) : home_url( '/' . $slug . '/' );
}

/**
 * Vrai si la page passée en slug est celle qui est affichée.
 *
 * @param string $slug Identifiant de la page.
 * @return bool
 */
function copro_est_courante( $slug ) {
	$page = get_page_by_path( $slug );
	return ( $page && (int) $page->ID === get_queried_object_id() );
}

/**
 * Les entrées de la navigation principale.
 *
 * Si un menu WordPress est affecté à l'emplacement « principale », il
 * fait foi — le client peut donc réordonner ses pages depuis
 * Apparence › Menus. Sinon on retombe sur la navigation d'origine.
 *
 * @return array Liste de tableaux { titre, url, courant }.
 */
function copro_entrees_menu() {
	$entrees    = array();
	$id_courant = get_queried_object_id();

	$emplacements = get_nav_menu_locations();
	if ( ! empty( $emplacements['principale'] ) ) {
		$objets = wp_get_nav_menu_items( $emplacements['principale'] );
		if ( $objets ) {
			foreach ( $objets as $objet ) {
				if ( (int) $objet->menu_item_parent !== 0 ) {
					continue; // Le design ne prévoit pas de sous-menu.
				}
				$entrees[] = array(
					'titre'   => $objet->title,
					'url'     => $objet->url,
					'courant' => ( (int) $objet->object_id === $id_courant ),
				);
			}
			return $entrees;
		}
	}

	// Repli : la navigation du site statique.
	$defauts = array(
		'a-propos'   => 'À propos',
		'ressources' => 'Ressources',
		'faq'        => 'FAQ',
	);
	foreach ( $defauts as $slug => $titre ) {
		$entrees[] = array(
			'titre'   => $titre,
			'url'     => copro_url( $slug ),
			'courant' => copro_est_courante( $slug ),
		);
	}
	return $entrees;
}

/**
 * Les entrées du menu mobile : accueil, la navigation principale, puis
 * contact. Le design numérote chaque ligne, d'où la construction ici.
 *
 * @return array
 */
function copro_entrees_menu_mobile() {
	$entrees = array(
		array(
			'titre'   => 'Accueil',
			'url'     => home_url( '/' ),
			'courant' => is_front_page(),
		),
	);
	$entrees   = array_merge( $entrees, copro_entrees_menu() );
	$entrees[] = array(
		'titre'   => 'Contact',
		'url'     => copro_url( 'contact' ),
		'courant' => copro_est_courante( 'contact' ),
	);
	return $entrees;
}
