<?php
/** @var \App\Model\Player[] $players */
/** @var \App\Service\Router $router */

$title = 'Basketball Players List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Basketball Players List</h1>

    <a href="<?= $router->generatePath('player-create') ?>">Create new player</a>

    <ul class="index-list">
        <?php foreach ($players as $player): ?>
            <li>
                <strong><?= $player->getName() ?></strong>
                (<?= $player->getTeam() ?> - #<?= $player->getNumber() ?>)
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('player-show', ['id' => $player->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('player-edit', ['id' => $player->getId()]) ?>">Edit</a></li>
                    <li>
                        <form action="<?= $router->generatePath('player-delete', ['id' => $player->getId()]) ?>" method="post" onsubmit="return confirm('Are you sure?')">
                            <input type="submit" value="Delete" class="btn-delete">
                        </form>
                    </li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';