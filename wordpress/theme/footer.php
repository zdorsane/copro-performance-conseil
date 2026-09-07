<?php
/**
 * Pied de page.
 *
 * Reprend le pied de page du site statique, puis restitue le bloc que
 * chaque page plaçait après lui (appel à l'action collant sur mobile,
 * appel à l'action flottant sur l'accueil), conservé à l'import dans la
 * métadonnée « apres_footer ».
 */

$copro_uri      = get_template_directory_uri();
$copro_marque   = get_bloginfo( 'name' );
$copro_baseline = get_bloginfo( 'description' );
$copro_services = copro_url( 'services' );

// Liens légaux : le menu WordPress s'il est renseigné, sinon ceux du
// site d'origine. La page courante est signalée par aria-current.
$copro_legaux       = array();
$copro_emplacements = get_nav_menu_locations();
if ( ! empty( $copro_emplacements['legale'] ) ) {
	$copro_objets = wp_get_nav_menu_items( $copro_emplacements['legale'] );
	if ( $copro_objets ) {
		foreach ( $copro_objets as $copro_objet ) {
			$copro_legaux[] = array(
				'titre'   => $copro_objet->title,
				'url'     => $copro_objet->url,
				'courant' => ( (int) $copro_objet->object_id === get_queried_object_id() ),
			);
		}
	}
}
if ( ! $copro_legaux ) {
	$copro_defauts = array(
		'mentions-legales'          => 'Mentions légales',
		'politique-confidentialite' => 'Politique de confidentialité',
		'plan-du-site'              => 'Plan du site',
	);
	foreach ( $copro_defauts as $copro_slug => $copro_titre ) {
		$copro_legaux[] = array(
			'titre'   => $copro_titre,
			'url'     => copro_url( $copro_slug ),
			'courant' => copro_est_courante( $copro_slug ),
		);
	}
}
?>
</main>

<!-- ==================================================================
     FOOTER
     ================================================================== -->
<footer class="footer footer--compact">
  <div class="container">

    <div class="footer__top">

      <div class="footer__marque">
        <a class="logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php echo esc_attr( $copro_marque ); ?> — accueil">
          <img class="logo__mark" src="<?php echo esc_url( $copro_uri ); ?>/assets/img/logo.svg" alt="Logo <?php echo esc_attr( $copro_marque ); ?>" width="34" height="34">
          <span class="logo__text">
            <span class="logo__name"><?php echo esc_html( $copro_marque ); ?></span>
            <span class="logo__tag"><?php echo esc_html( $copro_baseline ); ?></span>
          </span>
        </a>
        <p class="footer__pitch">
          Nous accompagnons les syndics professionnels et les conseils syndicaux dans l’analyse des charges, des contrats et des prestations de copropriété, afin de faciliter des décisions fondées sur des éléments clairs et vérifiables.
        </p>
      </div>

      <div class="footer__cols">
        <div class="footer__col">
          <h3>Prestations</h3>
          <ul>
            <li><a href="<?php echo esc_url( $copro_services ); ?>#audit">Audit complet des contrats</a></li>
            <li><a href="<?php echo esc_url( $copro_services ); ?>#charges">Analyse des dépenses de la copropriété</a></li>
            <li><a href="<?php echo esc_url( $copro_services ); ?>#contrats">Renégociation des contrats</a></li>
            <li><a href="<?php echo esc_url( $copro_services ); ?>#optimisation">Optimisation des charges</a></li>
            <li><a href="<?php echo esc_url( $copro_services ); ?>#accompagnement">Accompagnement et conseil</a></li>
          </ul>
        </div>

        <div class="footer__col">
          <h3>Le cabinet</h3>
          <ul>
            <li><a href="<?php echo esc_url( copro_url( 'a-propos' ) ); ?>">À propos</a></li>
            <li><a href="<?php echo esc_url( copro_url( 'approche' ) ); ?>">Notre approche</a></li>
            <li><a href="<?php echo esc_url( copro_url( 'faq' ) ); ?>">Questions fréquentes</a></li>
            <li><a href="<?php echo esc_url( copro_url( 'contact' ) ); ?>">Contact</a></li>
          </ul>
        </div>
      </div>

    </div>

    <div class="footer__bottom">
      <p>© <span data-year><?php echo esc_html( gmdate( 'Y' ) ); ?></span> <?php echo esc_html( $copro_marque ); ?>. Tous droits réservés.</p>
      <nav class="footer__legal" aria-label="Liens légaux">
        <?php foreach ( $copro_legaux as $copro_lien ) : ?>
        <a href="<?php echo esc_url( $copro_lien['url'] ); ?>"<?php echo $copro_lien['courant'] ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $copro_lien['titre'] ); ?></a>
        <?php endforeach; ?>
      </nav>
    </div>

  </div>
</footer>

<?php
// Appel à l'action collant (mobile) ou flottant (accueil), propre à
// chaque page et conservé tel quel à l'import.
$copro_apres = copro_meta( 'apres_footer' );
if ( $copro_apres ) {
	echo $copro_apres; // phpcs:ignore WordPress.Security.EscapeOutput -- balisage figé à l'import.
}

wp_footer();
?>
</body>
</html>
