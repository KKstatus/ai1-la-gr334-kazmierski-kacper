<?php
/** @var \App\Model\Player $player */
/** @var \App\Service\Router $router */

$title = "Player: {$player->getName()}";
$bodyClass = 'show';

ob_start(); ?>
    <article>
        <h1><?= $player->getName() ?></h1>
        <ul>
            <li><strong>Team:</strong> <?= $player->getTeam() ?></li>
            <li><strong>Number:</strong> #<?= $player->getNumber() ?></li>
            <li><strong>Position:</strong> <?= $player->getPosition() ?></li>
        </ul>

        <ul class="action-list">
            <li><a href="<?= $router->generatePath('player-index') ?>">Back to list</a></li>
            <li><a href="<?= $router->generatePath('player-edit', ['id' => $player->getId()]) ?>">Edit</a></li>
        </ul>
    </article>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';