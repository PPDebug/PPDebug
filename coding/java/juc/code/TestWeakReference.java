/**
 * 弱引用实现类成员变量导致的内存泄露
 * @author pengpeng
 * @date 2022/9/9
 * VM args: -Xms100M -Xmx100M -Xmn50M -XX:SurvivorRatio=8 -XX:+PrintGCDetails
 *
 * Eden: 40M
 * FROM: 5M
 * TO: 5M
 * OLD: 50M
 */
public class TestWeakReference {
    private static final int _1M = 1 << 20;
    private static final int EPOCH = 10;

    public static void main(String[] args) throws InterruptedException {
        Entry[] table = new Entry[EPOCH];

        for(int i = 0; i < EPOCH; i++) {
            System.out.println("EPOCH: " + i);
            byte[] key = new byte[10 * _1M];
            table[i] = new Entry(key, new byte[10 * _1M]);
        }

    }

    /** simulate ThreadLocal.ThreadLocalMap.Entry */
    static class Entry extends WeakReference<byte[]> {
        /** The value associated with this ThreadLocal. */
        Object value;

        Entry(byte[] k, Object v) {
            super(k);
            value = v;
        }
    }
}