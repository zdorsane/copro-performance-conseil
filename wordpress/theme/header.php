<?php
/**
 * En-tête du site.
 *
 * Reprend à l'identique tout ce que le site statique plaçait entre
 * <body> et <main> : écran d'amorce, grain, barre de progression,
 * en-tête, menu mobile. Les rares variations d'une page à l'autre sont
 * pilotées par les métadonnées posées à l'import.
 */

$copro_menu        = copro_entrees_menu();
$copro_menu_mobile = copro_entrees_menu_mobile();
$copro_uri         = get_template_directory_uri();
$copro_marque      = get_bloginfo( 'name' );
$copro_baseline    = get_bloginfo( 'description' );

// Les pages légales n'affichent pas la barre de progression de lecture.
$copro_progression = ( '0' !== (string) copro_meta( 'barre_progression', '1' ) );

// Le repère de sections flottant n'existe que sur l'accueil. La
// métadonnée porte le nombre total de sections (« 09 »).
$copro_reperes = copro_meta( 'repere_sections' );

// Sur la page contact, l'appel à l'action du menu mobile renvoie vers
// le formulaire de la page plutôt que vers la page contact elle-même.
$copro_sur_contact = copro_est_courante( 'contact' );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<!-- ==================================================================
     ÉCRAN D'AMORCE
     ================================================================== -->
<div class="boot" data-boot aria-hidden="true">
  <svg class="boot__mark" viewBox="0 0 40 40" fill="none"
       stroke="currentColor" stroke-width="2.4"
       stroke-linecap="round" stroke-linejoin="round">
    <line data-boot-stroke style="--i:0" x1="10.5" y1="27.5" x2="22.5" y2="27.5"/>
    <line data-boot-stroke style="--i:1" x1="10.5" y1="21.5" x2="18.5" y2="21.5"/>
    <line data-boot-stroke style="--i:2" x1="10.5" y1="15.5" x2="14.5" y2="15.5"/>
    <path data-boot-stroke style="--i:3" d="M10 30.5 17 23.5 22 27 31 12"/>
  </svg>
  <p class="boot__label"><?php echo esc_html( $copro_marque ); ?></p>
</div>

<!-- Grain d'impression (décoratif) -->
<div class="grain" aria-hidden="true"></div>
<a class="skip-link" href="#contenu">Aller au contenu principal</a>

<?php if ( $copro_progression ) : ?>
<!-- Progression de lecture (décorative) -->
<div class="scroll-progress" data-progress aria-hidden="true"></div>
<?php endif; ?>

<?php if ( $copro_reperes ) : ?>
<!-- Repère de section flottant (décoratif, desktop uniquement) -->
<div class="section-count" data-section-count aria-hidden="true">
  <span><b data-count-cur>01</b> / <span data-count-tot><?php echo esc_html( $copro_reperes ); ?></span></span>
  <span data-count-label-out>Le point de départ</span>
</div>
<?php endif; ?>

<!-- ==================================================================
     HEADER
     ================================================================== -->
<header class="header" data-header>
  <div class="container header__inner">
    <a class="logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php echo esc_attr( $copro_marque ); ?> — accueil">
      <img class="logo__mark" src="<?php echo esc_url( $copro_uri ); ?>/assets/img/logo.svg" alt="Logo <?php echo esc_attr( $copro_marque ); ?>" width="34" height="34">
      <span class="logo__text">
        <span class="logo__name"><?php echo esc_html( $copro_marque ); ?></span>
        <span class="logo__tag"><?php echo esc_html( $copro_baseline ); ?></span>
      </span>
    </a>
    <nav class="nav" aria-label="Navigation principale">
      <?php foreach ( $copro_menu as $copro_entree ) : ?>
      <a class="nav__link" href="<?php echo esc_url( $copro_entree['url'] ); ?>"<?php echo $copro_entree['courant'] ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $copro_entree['titre'] ); ?></a>
      <?php endforeach; ?>
    </nav>
    <div class="header__actions">
      <a class="btn<?php echo $copro_sur_contact ? '' : ' magnet'; ?>" href="<?php echo esc_url( copro_url( 'contact' ) ); ?>"<?php echo $copro_sur_contact ? ' aria-current="page"' : ''; ?>>
        Demander mon premier échange gratuit
        <svg class="btn__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
      <button class="burger" data-burger type="button" aria-expanded="false" aria-controls="menu-mobile" aria-label="Ouvrir le menu">
        <span class="burger__box"><span class="burger__line"></span><span class="burger__line"></span><span class="burger__line"></span></span>
      </button>
    </div>
  </div>
</header>

<!-- Menu mobile -->
<div class="mobile-nav" id="menu-mobile" data-mobile-nav aria-hidden="true">
  <nav aria-label="Navigation mobile">
    <ul class="mobile-nav__list">
      <?php foreach ( $copro_menu_mobile as $copro_i => $copro_entree ) : ?>
      <li><a class="mobile-nav__link" href="<?php echo esc_url( $copro_entree['url'] ); ?>"<?php echo $copro_entree['courant'] ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $copro_entree['titre'] ); ?> <span><?php echo esc_html( sprintf( '%02d', $copro_i + 1 ) ); ?></span></a></li>
      <?php endforeach; ?>
    </ul>
  </nav>
  <div class="mobile-nav__footer">
    <?php if ( $copro_sur_contact ) : ?>
    <a class="btn btn--block" href="#formulaire">Aller au formulaire</a>
    <?php else : ?>
    <a class="btn btn--block" href="<?php echo esc_url( copro_url( 'contact' ) ); ?>">Demander mon premier échange gratuit</a>
    <?php endif; ?>
  </div>
</div>

<main id="contenu">
