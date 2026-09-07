<?php
/**
 * Pied de page réduit, propre à la page 404 : pas de colonnes de liens,
 * seulement un contact direct et la barre légale.
 */

$copro_marque = get_bloginfo( 'name' );

$copro_legaux = array(
	'mentions-legales'          => 'Mentions légales',
	'politique-confidentialite' => 'Politique de confidentialité',
	'plan-du-site'              => 'Plan du site',
);
?>
</main>

<footer class="footer">
  <div class="container">

    <p class="footer__contact-404">
      Une question ?
      <a href="mailto:contact@coproperformanceconseil.fr">contact@coproperformanceconseil.fr</a>
      <span aria-hidden="true">·</span>
      <a href="tel:+33617470857">+33 6 17 47 08 57</a>
    </p>

    <div class="footer__bottom" style="border-top:0; padding-top:0">
      <p>© <span data-year><?php echo esc_html( gmdate( 'Y' ) ); ?></span> <?php echo esc_html( $copro_marque ); ?>. Tous droits réservés.</p>
      <nav class="footer__legal" aria-label="Liens légaux">
        <?php foreach ( $copro_legaux as $copro_slug => $copro_titre ) : ?>
        <a href="<?php echo esc_url( copro_url( $copro_slug ) ); ?>"><?php echo esc_html( $copro_titre ); ?></a>
        <?php endforeach; ?>
      </nav>
    </div>

  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
