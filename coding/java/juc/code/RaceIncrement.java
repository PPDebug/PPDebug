public class RaceIncrement {
    private static final int N_THREAD = 100;
    private static final int N_ROUND = 1000;
    private static volatile int count = 0;

    private static void increase() {
        count++;
    }

    public static void main(String[] args) {
        for (int i = 0; i < N_THREAD; i++) {
            new Thread(() -> {
                for (int j = 0; j < N_ROUND; j++) {
                    increase();
                }
            }).start();
        }
        while (Thread.activeCount() > 2) {
            Thread.yield();
        }
        System.out.println(count);
    }
}