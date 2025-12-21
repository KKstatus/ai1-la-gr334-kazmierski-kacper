<?php
/** @var \App\Model\Player $player */
/** @var \App\Service\Router $router */

$title = $player->getId() ? "Edit Player: {$player->getName()}" : 'Create Player';
$bodyClass = 'edit';

ob_start(); ?>
    <h1><?= $player->getId() ? "Edit Player" : "Create New Player" ?></h1>

    <form action="<?= $router->generatePath($player->getId() ? 'player-edit' : 'player-create', ['id' => $player->getId()]) ?>" method="post" class="form">
        <div class="form-group">
            <label for="name">Name and Surname</label>
            <input type="text" id="name" name="player[name]" value="<?= $player->getName() ?>" required>
        </div>

        <div class="form-group">
            <label for="team">Team</label>
            <input type="text" id="team" name="player[team]" value="<?= $player->getTeam() ?>" required>
        </div>

        <div class="form-group">
            <label for="number">Jersey Number</label>
            <input type="number" id="number" name="player[number]" value="<?= $player->getNumber() ?>">
        </div>

        <div class="form-group">
            <label for="position">Position</label>
            <input type="text" id="position" name="player[position]" value="<?= $player->getPosition() ?>" placeholder="e.g. PG, SG, C">
        </div>

        <div class="form-group">
            <input type="submit" value="Save Player">
        </div>
    </form>

    <a href="<?= $router->generatePath('player-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';