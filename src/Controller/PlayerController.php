<?php
namespace App\Controller;

use App\Model\Player;
use App\Service\Router;
use App\Service\Templating;

class PlayerController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $players = Player::findAll();
        $html = $templating->render('player/index.html.php', [
            'players' => $players,
            'router' => $router,
        ]);

        return $html;
    }

    public function createAction(Templating $templating, Router $router): ?string
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $player = Player::fromArray($_POST['player']);
            $player->save();

            $path = $router->generatePath('player-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('player/edit.html.php', [
            'player' => new Player(),
            'router' => $router,
        ]);

        return $html;
    }

    public function editAction(int $id, Templating $templating, Router $router): ?string
    {
        $player = Player::find($id);
        if (! $player) {
            $path = $router->generatePath('player-index');
            $router->redirect($path);
            return null;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $player->fill($_POST['player']);
            $player->save();

            $path = $router->generatePath('player-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('player/edit.html.php', [
            'player' => $player,
            'router' => $router,
        ]);

        return $html;
    }

    public function showAction(int $id, Templating $templating, Router $router): ?string
    {
        $player = Player::find($id);
        if (! $player) {
            $path = $router->generatePath('player-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('player/show.html.php', [
            'player' => $player,
            'router' => $router,
        ]);

        return $html;
    }

    public function deleteAction(int $id, Router $router): ?string
    {
        $player = Player::find($id);
        if ($player) {
            $player->delete();
        }

        $path = $router->generatePath('player-index');
        $router->redirect($path);

        return null;
    }
}